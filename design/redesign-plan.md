# UI Redesign Plan

Restyle every page and shared component to match the Stitch mockups in
`design/stitch/`. This is a visual redesign only: no new pages or features.

## Decisions

| Topic       | Decision                                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| Theme       | Light theme 2 (`home-light`) is the default. Terminal Pulse (`home-dark`) is the dark theme.               |
| Switching   | Follows the OS (`prefers-color-scheme`), with a toggle in the header that is remembered in `localStorage`. |
| Styling     | Design tokens as CSS variables plus each component's scoped `<style>`. No Tailwind.                        |
| Scope       | Restyle the 12 existing pages only. Leaderboard, Quizzes, ⌘K search, and Terms/Privacy are out of scope.   |
| Delivery    | Five phased PRs, listed below.                                                                             |
| Button text | Title Case labels (for example "Start a Quiz"), never all caps.                                            |

### Decided during Phase 1

- **Dark mode is gated until Phase 5.** Pages that haven't been restyled hard-code white backgrounds, so dark mode would look broken on them. Until then, `followSystem` in the inline script in `src/app.html` is `false`, and `ThemeToggle` isn't mounted. To preview dark mode, run `localStorage.theme = 'dark'` in the browser console and reload the page (the theme is applied only at page load). Remove the key to go back to light. In Phase 5, set `followSystem` to `true` and mount the toggle in the header.
- **Contrast adjustments.** A few mockup colors fail WCAG AA, so they were nudged. The button fill is `#0277b6` instead of `#0284c7` (white text was 4.1:1, now 4.86:1). Muted text is `#64748b` in light mode and `#7c8a9e` in dark mode.
- **Legacy colors keep their old values in light mode.** Old names such as `--color-blue` and `--ocean-*` still resolve to the old palette in light mode, so pages that haven't been restyled look the same. In dark mode they point at the new tokens.
- **Base heading sizes stay as they were.** `h1` is 2–2.4rem and `h2` is 1rem, because unmigrated components depend on those sizes. Restyled components set their own sizes from the `--text-*` scale. Move the base headings onto the scale in Phase 5.

## Reference files

- `design/stitch/home-light/` contains the light theme 2 code, screenshot, and `DESIGN.md` spec. This is the primary reference.
- `design/stitch/home-dark/` contains the Terminal Pulse code, screenshot, and `DESIGN.md` spec. This is the dark theme reference.
- `design/stitch/home-light-alt/` contains light theme 1, kept for comparison only.

Stitch only designed the home page. Every other page should be derived from
the components and tokens in the two `DESIGN.md` files.

## Current state

- `src/lib/ocean-palette.css` defines the raw palette, and `src/routes/styles.css` maps it to semantic tokens such as `--color-text` and `--color-border`.
- 36 components have scoped `<style>` blocks. The largest are Header, ResourceListing, the Learn page, TryQuestion, and Question.
- About 20 hardcoded hex colors remain. Most are in the `QuestionTag` palette, plus fallbacks in Question, FAQ, Feedback, and Verify Email. These all have to become tokens or the dark theme will break.
- The current fonts are Arial and Fira Mono. The new fonts are Geist (UI) and JetBrains Mono (code, tags, metrics).
- Icons come from `unplugin-icons` with MDI. Keep MDI rather than switching to Stitch's Material Symbols, since MDI has equivalents.
- `src/routes/Counter.svelte` is unused leftover demo code. Delete it.

## Token set

Add `src/lib/styles/tokens.css` with one semantic token set. `:root` holds the
light values, and `[data-theme='dark']` overrides them with dark values.

| Token group     | Tokens                                                                                   | Light (Light 2)        | Dark (Terminal Pulse) |
| --------------- | ---------------------------------------------------------------------------------------- | ---------------------- | --------------------- |
| Canvas          | `--color-bg`                                                                             | `#f8fafc`              | `#070a0f`             |
| Surfaces        | `--color-surface`, `--color-surface-raised`, `--color-surface-sunken`                    | `#fff` / `#f1f5f9`     | `#0e1522` / `#151f32` |
| Borders         | `--color-border`, `--color-border-strong`                                                | `#e2e8f0` / `#cbd5e1`  | white 8% / 12%        |
| Text            | `--color-text`, `--color-text-secondary`, `--color-text-muted`                           | `#0f172a` / `#475569`  | `#dfe2ee` / `#b9cacb` |
| Primary         | `--color-primary`, `--color-primary-hover`, `--color-on-primary`, `--color-primary-soft` | `#0284c7`              | `#00f0ff`             |
| States          | `--color-success(-soft)`, `--color-error(-soft)`, `--color-warning(-soft)`               | emerald / rose / amber | emerald / red / amber |
| Focus           | `--focus-ring`                                                                           | 3px cobalt at 15%      | cyan glow             |
| Type            | `--font-sans`, `--font-mono`, plus a size scale from `headline-xl` to `label-sm`         | Geist, JetBrains Mono  | same                  |
| Shape and space | `--radius-sm/md/lg/full`, `--space-xs` to `--space-xl`, `--shadow-raised`                | 4px / 8px radii        | same radii, plus glow |

Topic colors (JS, CSS, React, HTTP, DOM, …) also become tokens, so that
`QuestionTag` and the topic grid work in both themes.

During phases 1–4, keep the old names (`--color-purple`, `--color-blue`,
`--ocean-*`) as aliases that point at the new tokens, so pages that haven't
been migrated yet don't break. Remove the aliases in phase 5.

## Phases

Each phase is one PR into `main`. Pages stay usable between PRs. Pages that
haven't been migrated yet will look partly old and partly new, which is expected.

### 1. Foundations

- `tokens.css` with the light and dark values, plus the old names as aliases.
- Theme switching:
  - An inline script in `app.html` sets `data-theme` before the page draws, to avoid a flash of the wrong theme.
  - It uses `localStorage` first and falls back to `prefers-color-scheme`.
  - Also set `color-scheme` to match.
- Fonts: self-host Geist and JetBrains Mono through `@fontsource`, and remove `@fontsource/fira-mono`.
- Rewrite `styles.css`: base type scale, headings, links, `pre` and `code`, focus-visible ring, and a page background.
- Primitives: `Button` and `ButtonLink` (primary, secondary, and ghost), `Card`, `QuestionTag`, `AuthTextInput`, `ErrorMessage`.

### 2. App shell

- `Header`:
  - Logo, nav pill (Home, Learn), Sign In, a primary "Start a Quiz" button, and a profile avatar.
  - A new theme toggle.
  - The mobile menu.
- `Footer` and `PageContent`: the new max width (1280px) and side gutters (16px on mobile, 32px on desktop).

### 3. Home page

- `WelcomeSection`: hero badge, headline with a gradient accent word, the two buttons, and the trust row.
- `TryQuestion`:
  - An editor-window frame (traffic lights, filename, topic tag).
  - Answer options with `[1]`–`[4]` key hints.
  - Correct and incorrect states, and an explanation panel.
- Restyle the three feature cards, the topics grid, and the closing call-to-action band.

### 4. Quiz flow

- `Question` and `RadioGroup` answer cards with these states: default, hover, selected, correct, incorrect, and keyboard focus.
- `Progress`, `CorrectFlair`, `/quiz`, `/quiz/results`, and `/quiz/results/[quizId]`.

### 5. Remaining pages and cleanup

- `/learn` and `ResourceListing`.
- `/profile` and `/profile/[userName]`, including the header, the KPI and stats cards, and profile info.
- `/login`, `/register`, `/verify-email`, and the social login buttons.
- `/feedback`, `/support` (replace the emoji icons with MDI icons), and `FAQ`.
- Cleanup:
  - Delete `ocean-palette.css`, the alias tokens, and `Counter.svelte`.
  - Remove all remaining hardcoded hex colors.

## Checks for every PR

- `npm run check`, `npx vitest --run`, and the Playwright e2e tests pass.
- Visual pass in light and dark at 375px, 768px, and 1280px:
  - no horizontal scroll;
  - no unreadable text in either theme.
- Text contrast meets WCAG AA, especially cobalt-on-white for links and muted text in dark mode.
- Keyboard: a visible focus ring on every interactive element, and quiz answers are selectable with keys.
- Screenshots attached to each PR (light and dark).

## Open questions (resolved in Phases 2–3)

These were settled while matching the home page to the target screenshot in
`design/stitch/home-dark/screen-target.png`. Change any of them in review.

1. **Copy:** the mockup wording is used, except where it promises something the site doesn't do. The closing panel says "Take a short quiz…" instead of "Take a 5-minute diagnostic test…", and "Free to play" replaces "Free community tier".
2. **Feature card visuals:** kept as static illustrations. They're marked `aria-hidden`, and a comment says they show example numbers. The card links go to pages that exist ("View your stats" → `/profile`, "See your rating" → `/profile`, "Browse learning resources" → `/learn`) instead of the mockup's analytics dashboard and leaderboard.
3. **Topic counts:** the real counts from `data/questions.json` (JavaScript 9, CSS 5, React 3, HTTP 15, DOM 2), hardcoded like the hero's "34" because the homepage is prerendered. The mockup's numbers were made up.
4. **Logo:** the mockup's `</>` mark, built as `Logo.svelte` (the Stitch logo image is hosted on Google and can't be reused).
5. **Radii:** each theme has its own. `--radius-button`, `--radius-card` and `--radius-panel` are 6/8/16px in light and 8/12/16px in dark.

Left out because they're out of scope: the Quizzes and Leaderboard nav links, ⌘K search, Terms and Privacy, the version badge, and the "00:45" timer and "100 pts" badge on the sample question.
