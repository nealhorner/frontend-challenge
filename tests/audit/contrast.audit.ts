import { expect, test, type Page } from '@playwright/test';
import { measureRenderedContrast } from './pixels';

// Contrast audit. Visits every page in each theme, measures each visible piece
// of text against its effective background (WCAG AA: 4.5:1, or 3:1 for large
// text; over a gradient, against its worst color stop), and in dark mode flags
// bright patches left over from hard-coded light colors. Text over an image
// can't be measured; it's listed as "unmeasured" without failing the run.
//
// Not part of the e2e suite. Run with `npm run audit:contrast`; see README.
//
// AUDIT_THEMES picks the themes to audit (default "dark,light"), and
// AUDIT_STRICT the ones whose issues fail the run (default: both).

const THEMES = (process.env.AUDIT_THEMES ?? 'dark,light').split(',').map((t) => t.trim());
const STRICT = (process.env.AUDIT_STRICT ?? 'dark,light').split(',').map((t) => t.trim());

type Issue =
  | {
      kind: 'contrast';
      ratio: number;
      el: string;
      text: string;
      // Set for text over a gradient: re-measured against rendered pixels
      pixelCheck?: { id: number; foregrounds: [number, number, number][]; min: number };
    }
  | { kind: 'bright-bg'; bg: string; el: string }
  // Text over an image can't be measured; it's listed but doesn't fail the run
  | { kind: 'unmeasured'; el: string; text: string };

// Runs in the page. Must be self-contained: Playwright serializes it.
function auditPage(): Issue[] {
  const rgba = (s: string) => {
    const m = s.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
    return m.length === 3 ? [...m, 1] : m;
  };
  const lum = (c: number[]) => {
    const v = c
      .slice(0, 3)
      .map((x) => x / 255)
      .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  const ratio = (a: number[], b: number[]) => {
    const x = lum(a);
    const y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const blend = (top: number[], under: number[]) =>
    under.slice(0, 3).map((v, i) => top[i] * top[3] + v * (1 - top[3]));
  const gradientColors = (image: string) => (image.match(/rgba?\([^)]*\)/g) ?? []).map(rgba);
  // Split a background-image list into its layers (top first), ignoring commas
  // inside parentheses.
  const splitLayers = (image: string) => {
    const out: string[] = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < image.length; i++) {
      if (image[i] === '(') depth++;
      else if (image[i] === ')') depth--;
      else if (image[i] === ',' && depth === 0) {
        out.push(image.slice(start, i));
        start = i + 1;
      }
    }
    out.push(image.slice(start));
    return out.map((l) => l.trim());
  };
  // Every background the element's text could sit on: layers (each gradient
  // and background color) are composited bottom-up from the first opaque one,
  // and a gradient contributes each of its color stops, so the worst case gets
  // measured. Returns null when the text sits over an image.
  const effectiveBgs = (el: Element | null): number[][] | null => {
    const layers: number[][][] = [];
    const isOpaque = (layer: number[][]) => layer.length > 0 && layer.every((c) => c[3] === 1);
    outer: for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      const clipsToText = cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text';
      if (cs.backgroundImage !== 'none' && !clipsToText) {
        for (const layer of splitLayers(cs.backgroundImage)) {
          if (layer.startsWith('url(')) return null;
          const colors = gradientColors(layer);
          if (!colors.length) continue;
          layers.push(colors);
          if (isOpaque(colors)) break outer;
        }
      }
      const c = rgba(cs.backgroundColor);
      if (c[3] > 0) layers.push([c]);
      if (c[3] === 1) break;
    }
    // Composite from the bottom: the last layer if it's opaque, else the page.
    let bases =
      layers.length && isOpaque(layers[layers.length - 1])
        ? layers.pop()!.map((c) => c.slice(0, 3))
        : [rgba(getComputedStyle(document.body).backgroundColor).slice(0, 3)];
    while (layers.length) {
      const layer = layers.pop()!;
      const next = new Map<string, number[]>();
      for (const base of bases) {
        for (const c of layer) {
          const b = blend(c, base);
          next.set(b.map(Math.round).join(), b);
        }
      }
      bases = [...next.values()];
    }
    return bases;
  };
  const isVisible = (el: Element) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return (
      r.width > 0 &&
      r.height > 0 &&
      cs.visibility !== 'hidden' &&
      cs.opacity !== '0' &&
      !el.closest('[aria-hidden="true"], .visually-hidden')
    );
  };
  const describe = (el: Element) => {
    const parts: string[] = [];
    for (
      let e: Element | null = el;
      e && e !== document.body && parts.length < 3;
      e = e.parentElement
    ) {
      const cls = [...e.classList].find((c) => !c.startsWith('s-') && !c.startsWith('svelte-'));
      parts.unshift(e.tagName.toLowerCase() + (cls ? '.' + cls : ''));
    }
    return parts.join(' > ');
  };

  const dark = document.documentElement.dataset.theme === 'dark';
  const issues: Issue[] = [];
  let pixelCheckId = 0;
  document
    .querySelectorAll('[data-audit-pixel]')
    .forEach((e) => e.removeAttribute('data-audit-pixel'));
  const seen = new Set<string>();

  for (const el of document.querySelectorAll('body *')) {
    if (!isVisible(el)) continue;
    const cs = getComputedStyle(el);

    const ownText = [...el.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent?.trim())
      .join(' ')
      .trim();
    const isControl = el.matches('input, textarea, select');
    // Gradient-filled text (background-clip: text) is drawn in its gradient's
    // colors, over the parent's background.
    const gradientText =
      (cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text') &&
      cs.backgroundImage !== 'none';
    const bgs = ownText || isControl ? effectiveBgs(gradientText ? el.parentElement : el) : null;
    if ((ownText || isControl) && !bgs && !el.matches(':disabled')) {
      const key = 'unmeasured|' + describe(el);
      if (!seen.has(key)) {
        seen.add(key);
        issues.push({ kind: 'unmeasured', el: describe(el), text: ownText.slice(0, 40) });
      }
    }
    if (bgs && !el.matches(':disabled')) {
      const fgs = gradientText ? gradientColors(cs.backgroundImage) : [rgba(cs.color)];
      let r = Infinity;
      for (const bg of bgs) for (const fg of fgs) r = Math.min(r, ratio(blend(fg, bg), bg));
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (parseInt(cs.fontWeight) >= 700 && size >= 18.66);
      const min = large ? 3 : 4.5;
      if (r < min && cs.opacity === '1') {
        const key = describe(el) + '|' + r.toFixed(1);
        if (!seen.has(key)) {
          seen.add(key);
          const field = el as HTMLInputElement;
          // Over a gradient the estimate assumes every glow at its strongest at
          // once; mark the element so the test can measure the real pixels.
          let pixelCheck;
          if (bgs.length > 1) {
            pixelCheckId += 1;
            el.setAttribute('data-audit-pixel', String(pixelCheckId));
            pixelCheck = {
              id: pixelCheckId,
              foregrounds: fgs.map((c) => c.slice(0, 3) as [number, number, number]),
              min
            };
          }
          issues.push({
            kind: 'contrast',
            ratio: +r.toFixed(2),
            el: describe(el),
            text: (ownText || field.value || field.placeholder || el.tagName).slice(0, 40),
            pixelCheck
          });
        }
      }
    }

    // In dark mode, flag bright areas (usually a hard-coded `white`). Bright
    // accents such as cyan primary buttons are fine when their text is readable.
    const own = rgba(cs.backgroundColor);
    if (dark && own[3] > 0.5 && lum(own) > 0.6) {
      const r = el.getBoundingClientRect();
      const area = r.width * r.height;
      const readableAccent = ratio(rgba(cs.color), own) >= 4.5 && area < 40000;
      if (!readableAccent && area > 400 && !el.closest('.resource-image')) {
        const key = 'bright|' + describe(el);
        if (!seen.has(key)) {
          seen.add(key);
          issues.push({ kind: 'bright-bg', bg: cs.backgroundColor, el: describe(el) });
        }
      }
    }
  }
  return issues;
}

async function answerCurrentQuestion(page: Page) {
  const question = page.locator('.question');
  const textInput = question.locator('input[type="text"]');
  if (await textInput.count()) {
    await textInput.fill('audit answer');
    await textInput.blur();
  } else {
    await question.locator('input[type="radio"]').first().check();
  }
}

for (const theme of THEMES) {
  test(`contrast audit: ${theme}`, async ({ browser }, testInfo) => {
    test.setTimeout(180_000);
    const results: Record<string, Issue[]> = {};

    const newPage = async () => {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      await context.addInitScript((t) => localStorage.setItem('theme', t), theme);
      return context.newPage();
    };

    async function audit(page: Page, name: string, url?: string, prepare?: () => Promise<void>) {
      if (url) await page.goto(url, { waitUntil: 'networkidle' });
      if (prepare) await prepare();
      await page.waitForTimeout(150);
      // Guard against auditing the wrong colors if the theme stops applying
      const applied = await page.evaluate(() => document.documentElement.dataset.theme);
      expect(applied, `${theme} theme was not applied on ${name}`).toBe(theme);
      const issues = await page.evaluate(auditPage);
      // Re-measure text over gradients against the rendered background, and keep
      // the issue only if the real contrast also falls short.
      const confirmed: Issue[] = [];
      for (const issue of issues) {
        if (issue.kind === 'contrast' && issue.pixelCheck) {
          const { id, foregrounds, min } = issue.pixelCheck;
          const measured = await measureRenderedContrast(page, id, foregrounds);
          if (measured !== null && measured >= min) continue;
          confirmed.push({
            kind: 'contrast',
            ratio: +(measured ?? issue.ratio).toFixed(2),
            el: issue.el,
            text: issue.text
          });
        } else {
          confirmed.push(issue);
        }
      }
      results[name] = confirmed;
      await page.screenshot({ path: testInfo.outputPath(`${theme}-${name}.png`), fullPage: true });
    }

    // --- Signed out ---
    const guest = await newPage();
    await audit(guest, 'home', '/');
    await audit(guest, 'learn', '/learn', () => guest.locator('.faq-question').first().click());
    await audit(guest, 'support', '/support');
    await audit(guest, 'feedback', '/feedback');
    await audit(guest, 'login', '/login');
    await audit(guest, 'register', '/register');
    await audit(guest, 'verify-email', '/verify-email');

    // --- Guest quiz: start screen, a question with the report form open, results ---
    await audit(guest, 'quiz-start', '/quiz');
    await guest.getByRole('button', { name: 'Start Quiz' }).click();
    await guest.locator('.question h2').waitFor();
    await audit(guest, 'quiz-question', undefined, async () => {
      await answerCurrentQuestion(guest);
      const flag = guest.locator('.flag-toggle');
      if (await flag.count()) await flag.click();
    });
    while (!/\/quiz\/results\//.test(guest.url())) {
      const question = guest.locator('.question');
      const prompt = await question.locator('h2').textContent();
      await answerCurrentQuestion(guest);
      await question.getByRole('button', { name: 'Submit', exact: true }).click();
      await guest.waitForFunction(
        (p) =>
          /\/quiz\/results\//.test(location.href) ||
          document.querySelector('.question h2')?.textContent !== p,
        prompt
      );
    }
    await guest.waitForLoadState('networkidle');
    await audit(guest, 'quiz-result');

    // --- Signed in: a throwaway user (the server runs without email verification) ---
    const id = `${Date.now()}${Math.floor(Math.random() * 1e6)}`;
    const user = await newPage();
    await user.goto('/register');
    await user.getByLabel('Name').fill(`Audit User ${id}`.slice(0, 50));
    await user.getByLabel('Email').fill(`audit-${id}@example.com`);
    await user.getByLabel('Password').fill('SuperSecret!42');
    await user.getByRole('button', { name: 'Register' }).click();
    await user.waitForURL('**/');
    await audit(user, 'profile', '/profile', () =>
      user.getByRole('button', { name: 'Delete Account' }).click()
    );
    await audit(user, 'quiz-results-list', '/quiz/results');
    await audit(user, 'public-profile', '/profile/example');

    // --- Report ---
    const lines: string[] = [];
    let total = 0;
    let unmeasured = 0;
    for (const [name, all] of Object.entries(results)) {
      const issues = all.filter((i) => i.kind !== 'unmeasured');
      total += issues.length;
      unmeasured += all.length - issues.length;
      lines.push(`${name}: ${issues.length ? `${issues.length} issue(s)` : 'OK'}`);
      for (const i of all) {
        lines.push(
          i.kind === 'contrast'
            ? `    ${i.ratio}:1  ${i.el}  "${i.text}"`
            : i.kind === 'bright-bg'
              ? `    bright background ${i.bg}  ${i.el}`
              : `    unmeasured (text over an image)  ${i.el}  "${i.text}"`
        );
      }
    }
    const report =
      `Contrast audit (${theme}): ${total} issue(s), ${unmeasured} unmeasured\n` + lines.join('\n');
    console.log('\n' + report + '\n');
    await testInfo.attach(`contrast-${theme}.txt`, { body: report, contentType: 'text/plain' });

    if (STRICT.includes(theme)) {
      expect(total, `${theme} mode has contrast issues; see the report above`).toBe(0);
    }
  });
}
