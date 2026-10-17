---
name: Terminal Pulse
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#ffdb9d'
  on-secondary: '#412d00'
  secondary-container: '#feb700'
  on-secondary-container: '#6b4b00'
  tertiary: '#d8ffe7'
  on-tertiary: '#003824'
  tertiary-container: '#65f2b5'
  on-tertiary-container: '#006d4a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#ffba20'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
  slate-bg-base: '#070A0F'
  slate-surface: '#0E1522'
  slate-surface-elevated: '#151F32'
  border-hairline: rgba(255, 255, 255, 0.08)
  border-glow: rgba(0, 240, 255, 0.35)
  accent-cyan: '#00F0FF'
  accent-amber: '#FFB800'
  state-success: '#10B981'
  state-error: '#EF4444'
  state-info: '#38BDF8'
  syntax-keyword: '#F43F5E'
  syntax-string: '#34D399'
  syntax-function: '#38BDF8'
  syntax-comment: '#64748B'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: -0.01em
  label-code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  label-badge:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a high-performance, developer-centric environment built for frontend engineers who value precision, technical depth, and mastery. Modernizing from basic legacy web defaults into a dark-mode-first developer cockpit, the aesthetic fuses sleek minimal ergonomics with refined technical glassmorphism and subtle glowing indicators reminiscent of modern CLI utilities and code execution terminals.

### Personality & Tone
- **Technical & Discerning:** Focused on signal-over-noise. Typography, spacing, and micro-interactions prioritize legibility and rapid comprehension.
- **Electric & Energizing:** High-impact moments—like correct streaks, rating boosts, and code execution feedback—burst with targeted luminescence against dark canvas layers.
- **Calm & Methodical:** Deep midnight slate backdrops mitigate eye strain during long-session drills and problem-solving sprees.

### Design Style Movement
- **Refined Developer Glass & Dark Slate:** Deep midnight navy and obsidian foundations layered with translucent zinc/slate container surfaces (`backdrop-filter: blur(16px)`), sub-pixel hairline borders (`rgba(255, 255, 255, 0.08)`), and controlled ambient glows rather than heavy drop shadows.

## Colors

The palette transforms the original palette's bright amber and teal into high-fidelity luminous tokens tuned strictly for dark mode.

- **Primary (`#00F0FF`):** Electric Cyan serves as the pulse of the UI. It powers active interactive states, selected answer cards, progress rings, and primary action buttons.
- **Secondary (`#FFB800`):** Vivid Amber embodies challenge, caution, and streak vitality—used for ELO rating meters, XP trackers, streak counters, and warning badges.
- **Tertiary (`#10B981`):** Emerald Mint validates correct solutions and verified mastery criteria.
- **Neutral (`#0B0F17`):** Midnight Obsidian base canvas, paired with elevated slate-zinc tints for container hierarchy (`#0E1522` and `#151F32`).

### Functional Syntax & States
- **Selection Glow:** Interactive choices emit a 0 0 16px soft wash of `#00F0FF` at 15% opacity when focused or selected.
- **Correct State:** Outlined with `#10B981`, paired with a tinted emerald backdrop (`rgba(16, 185, 129, 0.08)`).
- **Incorrect State:** Outlined with `#EF4444`, tinted crimson (`rgba(239, 68, 68, 0.08)`).
- **Code Block Syntax:** Dedicated syntax tokens guarantee contrast against the obsidian editor pane.

## Typography

Typography pairs **Geist** for crisp, geometric UI hierarchy with **JetBrains Mono** for all code blocks, metadata chips, technical statistics, and question tags (CSS, DOM, React).

- **Geist Headings:** Set with tight tracking (`-0.02em` to `-0.03em`) and high contrast against dark surfaces.
- **JetBrains Mono Badges & Code:** Preserves mechanical rhythm for question titles involving selector rules (e.g., `*p`, `.class`), variable declarations, and metrics (e.g., `1850 ELO`, `94.2% ACCURACY`).
- **Inline Code Blocks:** Rendered inside body copy with a subtle background badge (`rgba(255, 255, 255, 0.06)`), 3px vertical padding, and 6px horizontal padding.

## Layout & Spacing

The layout operates on an 8pt modular rhythm using a responsive 12-column grid system for desktop and a 4-column system for mobile viewports.

### Breakpoints & Composition
- **Desktop (1200px+):** Centered workspace container capped at `1280px` max-width. Challenges and code playgrounds utilize asymmetric split containers (60% interactive challenge code / 40% meta panel and rating summary).
- **Tablet (768px - 1199px):** 8-column layout with 24px margins; side-by-side elements collapse into vertically ordered cards.
- **Mobile (<768px):** 4-column layout with 16px margins. Interactive choices stretch full-width, fixed sticky bottom action bars anchor progress triggers.
- **Vertical Rhythm:** Modular spacing ensures question prompt, code snippet, choice matrix, and hint disclosures maintain balanced breathing room without unnecessary scrolling during quiz runs.

## Elevation & Depth

Visual depth is conveyed through translucent container tiers, sub-pixel glass styling, and localized luminescent edge lighting instead of blurred drop shadows.

### Surface Tiers
- **Base Canvas (Level 0):** Deep `#070A0F` flat backdrop with an optional 3% radial mesh glow centered behind primary action modules.
- **Card Tier 1 (Level 1):** `#0E1522` filled with 70% opacity, `backdrop-filter: blur(16px)`, surrounded by a hairline boundary: `1px solid rgba(255, 255, 255, 0.07)`.
- **Elevated Interactive Tier (Level 2):** `#151F32` at 90% opacity, elevated by an ultra-soft diffuse shadow: `0 8px 32px rgba(0, 0, 0, 0.5)` with an inner top highlight border: `1px solid rgba(255, 255, 255, 0.12)`.
- **Glow Elevation (Level 3 - Active/Terminal State):** Applied to selected cards or streak meters. Employs dual-stage elevation: `0 0 0 1px #00F0FF, 0 0 24px rgba(0, 240, 255, 0.22)`.

## Shapes

The design uses a refined balance between modern squircle containers and technical pill-shaped status components.

- **Standard Containers & Cards (`rounded-lg`, 1rem / 16px):** Primary quiz modules, answer cards, and explanation containers utilize 16px corner radii to balance soft ergonomics with structured alignment.
- **Interactive Option Blocks (`rounded-md`, 0.75rem / 12px):** Answer options maintain a structured 12px curve for clean stacking inside quiz boards.
- **Chips, Category Tags & Status Pills (`rounded-full`, 9999px):** All categorical markers (e.g., `CSS`, `React`, `DOM`, `34 challenges`) use fully rounded pill geometry.
- **Inputs & Action Buttons (`rounded-md`, 0.5rem / 8px):** Sharp enough to signify deliberate, click-precise controls.

## Components

### Buttons
- **Primary Action (Start Quiz / Submit):** Electric Cyan background (`#00F0FF`), dark obsidian text (`#070A0F`), font weight `600`, with subtle cyan glow on hover (`box-shadow: 0 0 20px rgba(0, 240, 255, 0.4)`).
- **Secondary / Ghost (Sign In / Share):** Transparent background, `1px solid rgba(255, 255, 255, 0.12)`, text `#F1F5F9`. On hover, background shifts to `rgba(255, 255, 255, 0.05)` with crisp white border.

### Interactive Quiz Cards
- **Default State:** Background `#0E1522`, border `1px solid rgba(255, 255, 255, 0.08)`, text in mono/sans mix. Includes hotkey indicator pill (e.g. `[A]`, `[B]`) on the left in subtle slate.
- **Hover State:** Border elevates to `rgba(0, 240, 255, 0.4)`, background transitions to `#131D2E`.
- **Selected State:** Border `1.5px solid #00F0FF`, background `rgba(0, 240, 255, 0.08)`, cyan box glow.
- **Correct State:** Border `1.5px solid #10B981`, background `rgba(16, 185, 129, 0.1)`, checkmark badge replaces hotkey.
- **Incorrect State:** Border `1.5px solid #EF4444`, background `rgba(239, 68, 68, 0.1)`, cross badge replaces hotkey.

### Pill Badges & Topic Tags
- **Technology Badges (`CSS`, `React`, `HTTP`):** Pill-shaped with subtle translucent tinted backgrounds (`rgba(0, 240, 255, 0.1)`), mono uppercase label font, and border `1px solid rgba(0, 240, 255, 0.2)`.
- **Difficulty & Meta Badges:** Amber-tinted pills for advanced challenges, neutral zinc for general counts (`no sign-up needed`).

### Rating & ELO Meter
- Compact glass cockpit widget showing current ELO (e.g., `1640 ELO`) paired with a vivid linear bar or radial dial.
- Progress track rendered in slate (`rgba(255, 255, 255, 0.08)`); filled indicator uses a gradient transitioning from Electric Cyan (`#00F0FF`) to Amber Gold (`#FFB800`).

### Explanation Accordion / Drawer
- Appears post-submission below the answer set.
- Styled in `#0A101A` with a top divider accent: `1px solid rgba(16, 185, 129, 0.4)` for correct or crimson for incorrect answers.
- Houses technical deep-dive breakdown with syntax-highlighted code examples and reference links.