# Frontend Challenge

A simple CRUD application to help users practice their frontend skills.

## Developing

Environment variables are managed with [Varlock](https://varlock.dev).
`.env.schema` (committed) declares every variable the app reads: its type,
whether it's required, and whether it's secret. Put your local values in
`.env.local` (or `.env`); both are gitignored. Real environment variables, such
as Railway's, always take precedence over files.

```bash
npm install
touch .env.local          # then fill in the required values from .env.schema
npx varlock load          # check your values against the schema
npm run dev
```

The required values are `DATABASE_URL`, `BETTER_AUTH_SECRET` and
`BETTER_AUTH_URL`. Dev, build and the npm scripts fail with a clear message if
one is missing or invalid.

App code reads values from `ENV` (`import { ENV } from 'varlock/env'`), which
is typed from the schema (`src/env.d.ts` is generated; don't edit it) and keeps
secrets out of browser bundles. Anything that runs app code outside Vite goes
through `varlock run --` (see the `start`, `preview`, `db:*` and script
commands in `package.json`).

### Updating the database

Create migration

```bash
npm run db:migrate
```

Seed the database

```bash
npm run db:seed
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
`railway.json`. See `.env.schema` for the environment variables; set them as
Railway service variables. `npm run start` runs `varlock run -- node build`,
which validates them at boot.
