# Frontend Challenge — Product Roadmap

A planning document for the next phase of **Frontend Challenge**, a quiz-and-learn
web app that helps developers practice frontend skills, track accuracy, and climb
a community ranking.

## Where we are today

**Stack:** SvelteKit 2 + Svelte 5 (runes), TypeScript, Prisma 7 + PostgreSQL,
BetterAuth (email/password, GitHub + Google OAuth, anonymous guest sessions),
Argon2 password hashing, Sentry, Playwright (e2e) + Vitest (unit). Deployed via
`adapter-node` on Railway (a Vercel adapter is also wired up).

**What works:**

- **Quiz engine** — 10-question quizzes (`defaultQuizSize`), one question per
  "family" so topics don't repeat, with two question types: `multiple_choice`
  and `blind_answer`.
- **ELO ratings** — both users _and_ questions carry an ELO rating (K-factor 32);
  answering shifts both ([eloRating.ts](src/lib/eloRating.ts)).
- **Stats & streaks** — `UserStats` plus daily `UserStatsTrends` snapshots drive
  accuracy, ELO, a SQL-computed global `rank`, and current/longest streaks.
- **Profiles** — public profile pages with bio, social links, and stat KPIs.
- **Learn page** — curated resources (podcasts, courses, …) enriched with Open
  Graph metadata, plus engagement-event tables.
- **Guest flow** — anonymous users can play immediately; their quizzes and stats
  migrate to a real account on sign-up.

**Notable gaps the roadmap addresses:**

- `rank` is computed and stored, and the homepage + meta description promise
  "climb the leaderboard," but **no leaderboard page exists**.
- The quiz UI says _"Select a category"_, yet question selection is purely random
  across families ([quiz/+page.server.ts](src/routes/quiz/+page.server.ts)).
- Questions are hand-authored in `data/questions.json` and seeded; the large
  backlog in [FutureQuestions.md](FutureQuestions.md) has no content pipeline.
- `LearningEngagementEvents` / `...Aggregated` tables are populated but never
  surfaced, and resource descriptions are DOMPurify-sanitized on every request
  (there's a `// TODO move this to cron job`).
- Only two question types; no adaptive selection, achievements, or result sharing.

---

## Milestones at a glance

| #   | Milestone                           | Theme              | Size | Depends on      |
| --- | ----------------------------------- | ------------------ | ---- | --------------- |
| 1   | Leaderboard & ranking surface       | Close the loop     | M    | —               |
| 2   | Topic & difficulty selection        | Core UX            | M    | —               |
| 3   | Adaptive question selection         | Personalization    | M    | 2               |
| 4   | Content pipeline & admin            | Scale content      | L    | —               |
| 5   | Richer interactive question types   | Differentiation    | L    | 4               |
| 6   | Gamification & daily challenge      | Engagement         | M    | 1               |
| 7   | Shareable results & social growth   | Acquisition        | M    | 1               |
| 8   | Learning loop & resource analytics  | Retention          | M    | 2               |
| 9   | Accessibility, PWA & i18n           | Reach & quality    | L    | —               |
| 10  | Production hardening                | Reliability        | M    | —               |
| 11  | Admin dashboard & anomaly detection | Operations & trust | L    | pairs with 4, 8 |

_Ordering is a suggested sequence, not a hard dependency chain — 1, 2, 4, 9, and
10 can start in parallel._

---

## Milestone 1 — Leaderboard & ranking surface

**Outcome:** Ship the `/leaderboard` route the product already promises.

The app computes a global `rank` with a `RANK() OVER (ORDER BY eloRating DESC)`
window function after every completed quiz, and the homepage ("Climb the
rankings") and `app.html` meta ("climb the leaderboard!") both sell it — but
there is nowhere to see it.

**Scope:**

- New `/leaderboard` route: top-N players by ELO with rank, accuracy, and streak.
- "Your position" row for the signed-in user (and a sign-up nudge for guests).
- Time-window filters (all-time vs. weekly) backed by `UserStatsTrends`.
- Link it from the header, homepage CTA, and each profile's rank KPI.

**Done when:** a public leaderboard renders top players plus the current user's
standing, and the homepage/meta promises resolve to a real page.

## Milestone 2 — Topic & difficulty selection

**Outcome:** Let users choose what they practice instead of getting a random mix.

`Question.tags` already exists and the quiz screen literally says "Select a
category," but `selectQuestions()` just shuffles all questions and dedupes by
family. This is the highest-leverage UX gap.

**Scope:**

- Pre-quiz picker for topic(s) (HTML / CSS / JavaScript / DOM / React / HTTP …)
  and optional difficulty band derived from question ELO.
- Parameterize `selectQuestions()` to filter by tag/family and ELO range.
- A browsable topic index so users can see coverage per area.

**Done when:** a user can start a quiz scoped to chosen topics/difficulty, and the
"select a category" copy is backed by real behavior.

## Milestone 3 — Adaptive question selection

**Outcome:** Match question difficulty to each user and stop repeating questions.

ELO is calculated for both sides but unused for selection. Selection is random and
has no memory of what a user has already seen across quizzes.

**Scope:**

- Replace the random shuffle with ELO-matched selection (target questions near the
  user's `eloRating`).
- Add light spaced repetition: down-weight recently-seen questions using
  `QuizQuestion` history; resurface previously-missed ones.
- Tune via a configurable difficulty spread; measure accuracy convergence.

**Done when:** served questions track user skill, recent repeats drop measurably,
and per-user accuracy stabilizes around a target band.

## Milestone 4 — Content pipeline & admin

**Outcome:** Grow the question bank without hand-editing JSON and re-seeding.

Today every question lives in `data/questions.json` and reaches the DB via
`prisma/seed.ts`. [FutureQuestions.md](FutureQuestions.md) lists ~100 planned
topics with no path to publish them.

**Scope:**

- An `admin` capability (role/flag on `User`) with protected question CRUD.
- Authoring UI or validated bulk-import with schema checks (answers, options,
  tags, type) and a preview/review step before publish.
- Optional draft/published status so content can be staged.

**Done when:** a non-engineer can add or edit questions through a guarded UI/flow,
and backlog topics convert into live questions, growing the bank.

## Milestone 5 — Richer interactive question types

**Outcome:** Make it a real _frontend_ challenge, not just multiple choice.

Only `multiple_choice` and `blind_answer` exist. The core differentiator is
hands-on frontend practice.

**Scope:**

- Add ≥2 new `QuestionType` variants — e.g. fill-in-the-blank code, "spot the
  bug," or a sandboxed live HTML/CSS/JS challenge graded against expected output.
- Per-type rendering in [Question.svelte](src/lib/components/Question.svelte) and
  per-type grading in the answer API.
- Extend the seed/admin schema and ELO handling to cover the new types.

**Done when:** at least two interactive question types are authorable, gradable,
and live in quizzes.

## Milestone 6 — Gamification & daily challenge

**Outcome:** Give users reasons to return beyond a single quiz.

Streaks and ELO exist; there's no badge, achievement, or daily ritual.

**Scope:**

- Achievements/badges (first quiz, 7-day streak, topic mastery, ELO tiers) shown
  on profiles.
- A **daily challenge**: one shared question set per UTC day (the codebase already
  works in UTC via `getUTCDate()`), with its own streak.
- Optional XP/levels layered on existing stats.

**Done when:** users earn and display badges, and a daily challenge route drives a
distinct daily streak.

## Milestone 7 — Shareable results & social growth

**Outcome:** Turn results and profiles into acquisition channels.

A results page exists and profiles already carry social links; the app even does
Open Graph enrichment for learning resources — so the OG plumbing is familiar.

**Scope:**

- Dynamic OG share images for quiz results and profiles (score, accuracy, rank).
- "Share your score" actions (X, LinkedIn, Bluesky, copy-link) on results.
- Lightweight invite/referral attribution.

**Done when:** result and profile URLs render rich share cards, and shares are
tracked.

## Milestone 8 — Learning loop & resource analytics

**Outcome:** Connect missed questions to the right learning resources, and use the
engagement data already being collected.

`LearningEngagementEvents` and `LearningEngagementEventsAggregated` are populated
but never surfaced. Resource descriptions are sanitized with DOMPurify on _every_
request, with a standing `// TODO move this to cron job`.

**Scope:**

- After a quiz, recommend resources matched to the tags the user missed.
- An engagement view (most-clicked resources, trends) for users and/or admins.
- Move DOMPurify sanitization into the `populate-open-graph` job so the learn page
  load path stops re-sanitizing per request.

**Done when:** quizzes produce targeted resource suggestions, engagement data is
visible, and sanitization is off the request hot path.

## Milestone 9 — Accessibility, PWA & internationalization

**Outcome:** Make the app usable by more people, on more devices, offline.

Accessibility, PWAs, and i18n appear in the project's own future-topics list but
aren't reflected in the app yet.

**Scope:**

- Accessibility pass toward WCAG 2.1 AA (keyboard nav, focus states, ARIA,
  contrast, screen-reader checks) wired into CI where feasible.
- PWA: service worker, offline shell, installability (manifest already present).
- i18n scaffolding with at least one additional locale; mobile-first polish.

**Done when:** an a11y audit passes its targets, the app is installable and works
offline for core flows, and strings render through an i18n layer.

## Milestone 10 — Production hardening

**Outcome:** Make the app reliable and observable as usage grows.

**Scope:**

- Remove debug `console.log`s on the answer/quiz hot paths; route real errors
  through Sentry with useful context.
- Broaden tests beyond auth/oauth: e2e for quiz, results, leaderboard, and
  profile; raise unit coverage on scoring/streak/selection logic.
- Schedule the guest-cleanup script (`cleanupGuests`) and OG population as real
  cron jobs; add rate limiting beyond auth on answer/quiz endpoints.
- Add performance budgets and CI gates (lint, types, tests) on PRs.

**Done when:** logs are clean, critical flows are covered by tests in CI, scheduled
jobs run automatically, and perf budgets are enforced.

## Milestone 11 — Admin dashboard & anomaly detection

**Outcome:** A hidden, admin-only dashboard that surfaces live site activity,
question quality, and user-integrity signals.

There is no admin concept today — the legacy `role` column was dropped in the
BetterAuth migration in favor of the `isAnonymous` flag, so every user is a
regular user. This milestone introduces a deliberately minimal, database-only
admin role and the operational dashboard it unlocks. It is the natural home for
the analytics in Milestone 8 and reuses the same admin capability Milestone 4
needs for question CRUD.

**Admin model (DB-only by design):**

- Add an `isAdmin` boolean to `User`, default `false` — so **every user is regular
  by default**.
- The flag is **only ever set directly in the database** (manual SQL or a guarded
  `tsx` script). There is no UI, API, or self-serve path to grant admin, which
  keeps the privileged surface tiny and un-phishable.
- Guard the dashboard server-side in the route's `load`/hooks: non-admins (and
  guests) get a 404, not a redirect, so the page's existence isn't advertised. The
  route is unlinked from all navigation ("hidden").

**Dashboard — site activity:**

- Live/near-live activity: in-progress quizzes (`Quiz.isCompleted = false`),
  quizzes completed over time, new sign-ups, and guest-vs-registered split.
- **Average daily active users (DAU)** and **monthly active users (MAU)**, derived
  from `UserStatsTrends` (already one row per active day per user) and
  quiz-completion timestamps. Show average DAU over the selected window, rolling
  28/30-day MAU, and the DAU/MAU stickiness ratio as a trend over time.

**Dashboard — question performance:**

- **Most-frequently-incorrect questions:** rank `Question`s by incorrect rate from
  `QuizQuestion.isCorrect` aggregates (incorrect ÷ answered), with volume so
  low-sample questions don't dominate. Highlights confusing or mis-keyed items.
- Question ELO drift and answer distribution (which wrong options get picked) to
  spot ambiguous prompts.
- **Questions with the most feedback:** depends on a question-feedback feature,
  which **does not exist yet** (today's only "feedback" is the instant
  correct/incorrect UI). Scope a lightweight "report this question / leave
  feedback" capture, then rank questions by feedback volume here.

**Dashboard — user performance & cheating detection:**

- Per-user performance overview (accuracy, ELO trajectory, streaks, volume) to
  spot outliers.
- **Anomaly / cheating signals**, primarily timing-based:
  - **Per-question answer speed.** This requires instrumenting `askedTimestamp`,
    which is declared on `QuizQuestion` but **currently never written** (only
    `answeredTimestamp` is set). Record when each question is shown so
    `answeredTimestamp − askedTimestamp` becomes a usable latency.
  - **Quiz completion time** from `startedTimestamp → completedTimestamp`.
  - Flag implausible combinations: near-perfect accuracy at superhuman speed,
    answer latencies clustered below human reaction time, suspiciously uniform
    timings (scripted), and sudden ELO jumps inconsistent with history.
  - Surface flagged users in a review queue with the evidence (timings,
    accuracy, ELO delta) rather than auto-penalizing.

**Prerequisites bundled into this milestone:** add `isAdmin`; instrument
`askedTimestamp` on question display; add question-feedback capture.

**Done when:** an admin (set only via the database) can open a hidden dashboard
that shows current activity, ranks questions by incorrect-rate and feedback
volume, and lists users flagged by timing/accuracy anomalies — while non-admins
cannot tell the page exists.

---

## Cross-cutting principles

- **Guests first.** Every feature should degrade gracefully for anonymous users and
  preserve the guest → account migration path.
- **Stats integrity.** Changes to selection, scoring, or types must keep `UserStats`
  and `UserStatsTrends` consistent (they're recomputed, not just incremented).
- **Ship behind the promise.** Prefer closing gaps the UI already advertises
  (leaderboard, category selection) before adding net-new surface area.
