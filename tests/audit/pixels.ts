import { inflateSync } from 'node:zlib';
import type { Page } from '@playwright/test';

// Measures text contrast against the background pixels actually rendered
// behind it. The audit uses this for text over gradients, where the in-page
// estimate has to assume the worst color stop of every glow at once.

type Rgb = [number, number, number];

/** Decode an 8-bit, non-interlaced RGB/RGBA PNG (what Playwright screenshots produce). */
function decodePng(buf: Buffer) {
  let pos = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat: Buffer[] = [];
  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    }
    pos += 12 + length;
  }
  const bpp = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const left = x >= bpp ? out[y * stride + x - bpp] : 0;
      const up = y > 0 ? out[(y - 1) * stride + x] : 0;
      const upLeft = y > 0 && x >= bpp ? out[(y - 1) * stride + x - bpp] : 0;
      let value = line[x];
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += (left + up) >> 1;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        value += pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
      }
      out[y * stride + x] = value & 255;
    }
  }
  return { bpp, pixels: out };
}

const luminance = (c: Rgb) => {
  const v = c
    .map((x) => x / 255)
    .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const ratio = (a: Rgb, b: Rgb) => {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const HIDE_STYLE = `
  [data-audit-hide], [data-audit-hide] * {
    color: transparent !important;
    -webkit-text-fill-color: transparent !important;
    text-shadow: none !important;
    caret-color: transparent !important;
  }
  [data-audit-hide] { background-image: none !important; }
  [data-audit-hide] svg, [data-audit-hide] img { visibility: hidden !important; }
  [data-audit-hide]::before, [data-audit-hide]::after,
  [data-audit-hide] *::before, [data-audit-hide] *::after { visibility: hidden !important; }
`;

/**
 * Worst contrast of `foregrounds` against the background rendered behind the
 * element marked `data-audit-pixel="<id>"`, measured with its text hidden.
 */
export async function measureRenderedContrast(page: Page, id: number, foregrounds: Rgb[]) {
  const el = page.locator(`[data-audit-pixel="${id}"]`);
  await el.scrollIntoViewIfNeeded();
  const style = await page.addStyleTag({ content: HIDE_STYLE });
  await el.evaluate((e) => e.setAttribute('data-audit-hide', ''));
  try {
    const box = await el.boundingBox();
    if (!box || box.width < 1 || box.height < 1) return null;
    const { bpp, pixels } = decodePng(await page.screenshot({ clip: box }));
    let worst = Infinity;
    // Bound the contrast by the darker and lighter ends of the background,
    // using the 5th and 95th percentile so single grain specks don't count.
    const samples: Rgb[] = [];
    for (let i = 0; i < pixels.length; i += bpp)
      samples.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
    samples.sort((a, b) => luminance(a) - luminance(b));
    const darkest = samples[Math.floor((samples.length - 1) * 0.05)];
    const brightest = samples[Math.floor((samples.length - 1) * 0.95)];
    for (const fg of foregrounds) {
      worst = Math.min(worst, ratio(fg, darkest), ratio(fg, brightest));
    }
    return worst;
  } finally {
    await el.evaluate((e) => e.removeAttribute('data-audit-hide'));
    await style.evaluate((node) => (node as Element).remove());
  }
}
