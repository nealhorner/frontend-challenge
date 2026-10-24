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

A contrast audit loads every page in light and dark mode. It checks each
piece of text against its background (WCAG AA) and, in dark mode, looks for
leftover hard-coded light backgrounds. Run it after changing colors or
styles:

```bash
npm run audit:contrast
```

It builds and serves the app the same way the e2e tests do, so it needs the
local database. Locally, add `PLAYWRIGHT_CHANNEL=chrome` to use your installed
Chrome. It prints a report per theme and saves screenshots under
`test-results/`. Any issue in either theme fails the run. Set
`AUDIT_THEMES=dark` to audit one theme, or `AUDIT_STRICT=dark` to report
light-mode issues without failing.

## Building

```bash
npm run build
```

## Deploying

Production runs on Railway with `@sveltejs/adapter-node`, configured in
`railway.json`. See `.env.example` for the environment variables.
