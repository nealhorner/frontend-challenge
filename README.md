# Frontend Challenge

A simple CRUD application to help users practice their frontend skills.

## Developing

Create a `.env` file based on .env.example

```bash
npm install
npm run dev
```

### Updating the database

Create migration

```bash
npm run db:migrate
```

Seed the database

```bash
npx tsx prisma/seed.ts
```

### Checking color contrast

The redesign (see `design/redesign-plan.md`) has a contrast audit that loads
every page in light and dark mode. It checks each piece of text against its
background (WCAG AA) and, in dark mode, looks for leftover hard-coded light
backgrounds. Run it after restyling pages:

```bash
npm run audit:contrast
```

It builds and serves the app the same way the e2e tests do, so it needs the
local database. Locally, add `PLAYWRIGHT_CHANNEL=chrome` to use your installed
Chrome. It prints a report per theme and saves screenshots under
`test-results/`. Issues in dark mode fail the run; light mode is report-only
until phases 4–5. Set `AUDIT_STRICT=dark,light` to fail on both, or
`AUDIT_THEMES=dark` to audit one theme.

## Building

```bash
npm run build
```

## Deploying

Production runs on Railway with `@sveltejs/adapter-node`, configured in
`railway.json`. See `.env.example` for the environment variables.
