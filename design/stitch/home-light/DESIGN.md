---
name: Terminal Pulse Light
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4850'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#b90538'
  on-tertiary: '#ffffff'
  tertiary-container: '#dc2c4f'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-body:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 22px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system targets ambitious frontend engineers, technical interview candidates, and design technologists engaging with interactive code quizzes and skill-benchmarking challenges. 

The aesthetic merges developer-grade utility with modern editorial clarity—termed "Technical Precision Minimalism." It avoids the clichéd, gloomy dark-terminal archetype in favor of an alert, sunlit IDE ambiance: sterile white backing, structured zinc and slate panels, razor-thin borders, and focused micro-interactions. The interface communicates speed, rigor, and cognitive clarity, evoking the quiet focus of a well-configured modern development environment.

## Colors

The palette establishes an ultra-clean, clinical canvas designed for prolonged screen reading and code evaluation:

- **Primary (`#0284c7` - Electric Sky/Cobalt):** Drives active selection rings, interactive primary actions, progress meters, and key syntax highlights.
- **Secondary (`#10b981` - Vibrant Emerald):** Reserved strictly for successful states, correct challenge answers, passing test assertions, and streak badges.
- **Tertiary (`#f43f5e` - Vivid Rose):** Signals failing assertions, syntax errors, time expirations, and destructive operations.
- **Neutrals & Surfaces:**
  - Base Canvas: `#ffffff`
  - Subtle Surface (Panels, Editor Gutters, Code Blocks): `#f8fafc`
  - Elevated Container / Hover Wells: `#f1f5f9`
  - Subtle Borders: `#e2e8f0` (panels) and `#cbd5e1` (interactive inputs)
  - Text Primary: `#0f172a` (high-contrast slate-950)
  - Text Secondary: `#475569`
  - Text Muted: `#94a3b8`

Syntax tokens rely on light-theme IDE conventions: keywords in `#0284c7`, strings in `#059669`, tags/operators in `#64748b`, and variables in `#0f172a`.

## Typography

Typography pairs `Geist` for rapid, crisp scanning across editorial and instructional UI copy with `JetBrains Mono` for metadata, metrics, keystrokes, tags, and inline/block code.

- **Headlines:** Set in high-contrast slate-900 with tight tracking (`-0.02em` to `-0.03em`) to anchor the engineering perspective.
- **Body:** Uses balanced line heights for deep comprehension during intricate multi-part question prompts.
- **Labels & Code:** Monospaced elements use `JetBrains Mono` with explicit tabular numbering to prevent jitter in live timers, scoreboards, line numbers, and unit test results.

## Layout & Spacing

The layout follows a modular IDE workbench structure:

- **Desktop (>= 1024px):** A split-screen fluid layout. Left side hosts the problem prompt and multiple-choice or submission parameters (max-width bounded to 680px for optimal reading); right side hosts the interactive code sandbox/diff inspector.
- **Tablet (768px - 1023px):** Vertical split with tabbed switching between "Task Overview" and "Code Execution Console."
- **Mobile (< 768px):** Single-column stacked arrangement with sticky bottom action dock for submission and execution. Outer margin drops to `1rem`.

Spacing operates strictly on a 4px/8px modular rhythm to mirror code line-height and terminal spacing. Layout components favor tight, intentional padding (`space-md`, `space-lg`) rather than oversized whitespace, maintaining a dense, desktop-grade information density.

## Elevation & Depth

Visual hierarchy is constructed through **tonal layering** and **low-contrast micro-outlines** rather than dramatic drop shadows:

- **Base Layer (Level 0):** Pure `#ffffff` background.
- **Container Layer (Level 1):** `#f8fafc` surface bounded by a continuous 1px `#e2e8f0` border.
- **Active / Interactive Layer (Level 2):** `#ffffff` surface with a delicate directional ambient shadow (`0 1px 3px 0 rgba(15, 23, 42, 0.05)`) and 1px `#cbd5e1` outline to emphasize floating elements like dropdown menus, popovers, and sticky action toolbars.
- **Focus / Active Selection:** Outlines shift to `#0284c7` with a 2px offset or an outer ring (`0 0 0 3px rgba(2, 132, 199, 0.15)`).
- **Correct State Highlight:** 1px border `#10b981` paired with a soft background wash (`#ecfdf5`).

## Shapes

The design system employs a **Soft (Level 1)** shape logic:

- Default buttons, inputs, badge tags, and multiple-choice options have `0.25rem` (4px) corner radii.
- Larger cards, editor frames, split panes, and preview canvas panels scale to `0.5rem` (8px).
- Status indicator pills and keyboard shortcut keycaps (`<kbd>`) use `0.25rem` (4px).

This subtle curvature preserves the sharp, engineered discipline of an IDE while smoothing out visual tension at high screen densities.

## Components

### Buttons
- **Primary:** Solid `#0284c7` background, white label in `Geist` medium, 1px solid `#0284c7`. Hover shifts to `#0369a1`.
- **Secondary / Ghost:** `#ffffff` surface, 1px `#e2e8f0` border, `#0f172a` text. Hover shifts to `#f8fafc` with `#cbd5e1` border.
- **Terminal Run Action:** `#10b981` background with white text and `JetBrains Mono` bold uppercase label (`RUN TESTS [⌘↵]`).

### Multiple-Choice Quiz Options
- Default state: `#ffffff` background, 1px border `#e2e8f0`, keyboard shortcut identifier badge (`A`, `B`, `C`, `D`) in monospaced muted zinc.
- Hover: Border shifts to `#94a3b8` with subtle background tint `#f8fafc`.
- Selected: Border `#0284c7` (1.5px), background `#f0f9ff`.
- Verified Correct: Border `#10b981`, background `#f0fdf4`, indicator icon in emerald green.
- Verified Incorrect: Border `#f43f5e`, background `#fff1f2`, indicator icon in vivid rose.

### Code Editor Panels & Previews
- Enclosed inside a 1px `#e2e8f0` container with a `#f8fafc` header strip featuring breadcrumbs (`App.tsx`), read-only pill badge, and copy button.
- Editor viewport: Background `#ffffff`, line numbers in `#94a3b8` JetBrains Mono, active line highlight in `#f1f5f9`.

### Chips & Badges
- **Difficulty Tag:** `label-sm` with 4px radius. Easy in emerald (`#ecfdf5` bg, `#047857` text), Medium in amber (`#fffbeb` bg, `#b45309` text), Hard in rose (`#fff1f2` bg, `#be123c` text).
- **Category Pill:** 1px `#e2e8f0` border, `#f8fafc` background, slate text.

### Form Inputs & Checkboxes
- **Input Fields:** Crisp 1px `#cbd5e1` outline, `#ffffff` surface, focused with a 2px `#0284c7` border glow (`rgba(2, 132, 199, 0.12)`).
- **Checkboxes:** Custom square with 3px border radius, `#0284c7` fill when checked with a crisp white check vector.