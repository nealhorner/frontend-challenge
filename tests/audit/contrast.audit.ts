import { expect, test, type Page } from '@playwright/test';

// Contrast audit for the redesign. Visits every page
// in each theme, measures each visible piece of text against its effective
// background (WCAG AA: 4.5:1, or 3:1 for large text), and in dark mode flags
// bright patches left over from hard-coded light colors.
//
// Not part of the e2e suite. Run with `npm run audit:contrast`; see README.
//
// AUDIT_THEMES picks the themes to audit (default "dark,light"), and
// AUDIT_STRICT the ones whose issues fail the run (default: both).

const THEMES = (process.env.AUDIT_THEMES ?? 'dark,light').split(',').map((t) => t.trim());
const STRICT = (process.env.AUDIT_STRICT ?? 'dark,light').split(',').map((t) => t.trim());

type Issue =
  | { kind: 'contrast'; ratio: number; el: string; text: string }
  | { kind: 'bright-bg'; bg: string; el: string };

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
  // Blend translucent background layers down to the first opaque one. Text over
  // a gradient or image can't be measured this way, so it's skipped.
  const effectiveBg = (el: Element): number[] | null => {
    const layers: number[][] = [];
    for (let e: Element | null = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('url(')) return null;
      const c = rgba(cs.backgroundColor);
      if (c[3] === 0) continue;
      layers.push(c);
      if (c[3] === 1) break;
    }
    let base =
      layers.length && layers[layers.length - 1][3] === 1
        ? layers.pop()!.slice(0, 3)
        : rgba(getComputedStyle(document.body).backgroundColor).slice(0, 3);
    while (layers.length) {
      const c = layers.pop()!;
      base = base.map((v, i) => c[i] * c[3] + v * (1 - c[3]));
    }
    return base;
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
    const bg = ownText || isControl ? effectiveBg(el) : null;
    if (bg && !el.matches(':disabled')) {
      const fg = rgba(cs.color);
      const blended = fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3]));
      const r = ratio(blended, bg);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (parseInt(cs.fontWeight) >= 700 && size >= 18.66);
      if (r < (large ? 3 : 4.5) && cs.opacity === '1') {
        const key = describe(el) + '|' + r.toFixed(1);
        if (!seen.has(key)) {
          seen.add(key);
          const field = el as HTMLInputElement;
          issues.push({
            kind: 'contrast',
            ratio: +r.toFixed(2),
            el: describe(el),
            text: (ownText || field.value || field.placeholder || el.tagName).slice(0, 40)
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
      results[name] = await page.evaluate(auditPage);
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
    for (const [name, issues] of Object.entries(results)) {
      total += issues.length;
      lines.push(`${name}: ${issues.length ? `${issues.length} issue(s)` : 'OK'}`);
      for (const i of issues) {
        lines.push(
          i.kind === 'contrast'
            ? `    ${i.ratio}:1  ${i.el}  "${i.text}"`
            : `    bright background ${i.bg}  ${i.el}`
        );
      }
    }
    const report = `Contrast audit (${theme}): ${total} issue(s)\n` + lines.join('\n');
    console.log('\n' + report + '\n');
    await testInfo.attach(`contrast-${theme}.txt`, { body: report, contentType: 'text/plain' });

    if (STRICT.includes(theme)) {
      expect(total, `${theme} mode has contrast issues; see the report above`).toBe(0);
    }
  });
}
