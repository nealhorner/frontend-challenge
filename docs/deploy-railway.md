# Deploying to Railway

Production runs on [Railway](https://railway.com) as a plain Node server built
with `@sveltejs/adapter-node`. Vercel is no longer used: there is no Vercel
adapter, no `VERCEL` env switch, and nothing in the repo reads Vercel-provided
variables.

## How it fits together

| Railway service                                  | Config file                                | What it runs                                                                                           |
| ------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **web**                                          | `railway.json` (default)                   | Build `npm run build` → pre-deploy `npm run release` → start `npm run start` (`node build`) on `$PORT` |
| **Postgres**                                     | Railway template                           | Production database                                                                                    |
| **cleanup-guests** (cron, optional)              | `railway.cleanup-guests.json`              | `npm run cleanupGuests` daily at 03:00 UTC                                                             |
| **populate-learning-resources** (cron, optional) | `railway.populate-learning-resources.json` | `npm run populateLearningResources` daily at 04:00 UTC                                                 |

- `npm run release` = `prisma migrate deploy && npm run populateLearningResources`.
  It runs as Railway's **pre-deploy command**, inside the built image with the
  service's variables and private network, before the new version takes
  traffic. If migrations fail, the deploy stops and the old version keeps
  serving.
- The two scripts run through `tsx --tsconfig scripts/tsconfig.json`, which maps
  SvelteKit's `$env/dynamic/private` to `process.env` so `$lib/prisma` works
  outside Vite.
- Config-as-code in a `railway*.json` file overrides the same settings in the
  dashboard. Each cron service must point at its own config file, otherwise it
  would inherit the web service's start command, pre-deploy and health check.

## Environment variables

Railway passes a service's variables to both the build and the running app.
"Build-time" below means the value is baked into the build output, so changing
it needs a redeploy (Railway redeploys automatically when you save variables).

### web service

| Variable                | When       | Required           | Value                                                                                                  |
| ----------------------- | ---------- | ------------------ | ------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`          | runtime    | yes                | `${{Postgres.DATABASE_URL}}` (reference variable, private network). Also used by the pre-deploy step.  |
| `BETTER_AUTH_SECRET`    | runtime    | yes                | `openssl rand -base64 32`. Reuse the current production value or every user gets signed out.           |
| `BETTER_AUTH_URL`       | runtime    | yes                | Public base URL, no trailing slash. Railway URL first, custom domain after DNS cutover.                |
| `ORIGIN`                | runtime    | yes                | Same value as `BETTER_AUTH_URL`. adapter-node needs it behind Railway's proxy or form POSTs fail CSRF. |
| `RESEND_API_KEY`        | runtime    | yes                | Resend API key (verification + feedback emails).                                                       |
| `EMAIL_FROM`            | runtime    | yes                | e.g. `Frontend Challenge <noreply@yourdomain.com>`; must be on a domain verified in Resend.            |
| `FEEDBACK_EMAIL`        | runtime    | yes                | Inbox that receives feedback form submissions.                                                         |
| `GITHUB_CLIENT_ID`      | runtime    | for GitHub sign-in | GitHub OAuth app.                                                                                      |
| `GITHUB_CLIENT_SECRET`  | runtime    | for GitHub sign-in | GitHub OAuth app.                                                                                      |
| `GOOGLE_CLIENT_ID`      | runtime    | for Google sign-in | Google Cloud OAuth client.                                                                             |
| `GOOGLE_CLIENT_SECRET`  | runtime    | for Google sign-in | Google Cloud OAuth client.                                                                             |
| `PUBLIC_SENTRY_DSN`     | build-time | no                 | Sentry DSN (`$env/static/public`, inlined in client + server bundles). Empty disables reporting.       |
| `SENTRY_AUTH_TOKEN`     | build-time | no                 | Uploads source maps during `vite build`. Mark it sealed. Build still succeeds without it.              |
| `RAILPACK_NODE_VERSION` | build-time | recommended        | `24`. Pins Node to the version CI and local dev use (`engines` only says `>=24`).                      |

Do **not** set these in production:

- `NODE_ENV`: leave unset. Railpack handles it, and `NODE_ENV=production` at
  install time would skip the dev dependencies the build needs.
- `AUTH_DISABLE_RATE_LIMIT`, `REQUIRE_EMAIL_VERIFICATION`: e2e-only switches.
- `PORT`, `HOST`: Railway sets `PORT` and adapter-node already listens on `0.0.0.0`.

### cron services

Only `DATABASE_URL=${{Postgres.DATABASE_URL}}` (plus `RAILPACK_NODE_VERSION=24`).
The scripts don't send email or touch auth.

## Cutover checklist

Everything below is done in a dashboard; the repo changes are already on this
branch. ☐ = you do it.

### 1. Railway: create the project

- ☐ New project → **Deploy from GitHub repo** → this repo, branch `main` (merge
  this branch first). Name the service `web`.
- ☐ Add **Postgres** to the same project (New → Database → PostgreSQL).
- ☐ On `web` → Variables, add everything in the table above. Use the Railway
  domain (step 2) for `BETTER_AUTH_URL` / `ORIGIN` for now.
- ☐ `web` → Settings → Networking → **Generate Domain** (gives
  `https://<name>.up.railway.app`). Put that URL in `BETTER_AUTH_URL` and
  `ORIGIN`.
- ☐ Confirm Settings shows the builder as Railpack, pre-deploy `npm run release`,
  start `npm run start` and health check `/` (all read from `railway.json`).

### 2. Database

Pick one:

- **Fresh database**: nothing to do; the first deploy's pre-deploy step runs
  `prisma migrate deploy` and populates learning resources. Then load questions
  once from your machine:
  `DATABASE_URL="<Postgres DATABASE_PUBLIC_URL>" npm run db:seed`.
- **Moving existing production data** (from wherever Vercel's app pointed):
  - ☐ Pause writes (or pick a quiet window).
  - ☐ `pg_dump --format=custom --no-owner --no-acl "$OLD_DATABASE_URL" > prod.dump`
  - ☐ `pg_restore --no-owner --no-acl -d "<Railway DATABASE_PUBLIC_URL>" prod.dump`
  - ☐ Redeploy `web`; `prisma migrate deploy` then applies only migrations that
    aren't in `_prisma_migrations` yet.
- ☐ Check the deploy log for `prisma migrate deploy` succeeding and
  `✓ Populated learning resource Open Graph data`.

### 3. OAuth providers (callback URLs)

BetterAuth callbacks are `<BETTER_AUTH_URL>/api/auth/callback/<provider>`.

- ☐ **Google** (Cloud Console → APIs & Services → Credentials → your OAuth
  client): add authorized JavaScript origins and redirect URIs for both the
  Railway domain and the custom domain:
  `https://<name>.up.railway.app/api/auth/callback/google` and
  `https://yourdomain.com/api/auth/callback/google`. Google allows several, so
  keep the current one until cutover is done.
- ☐ **GitHub** (Settings → Developer settings → OAuth Apps): an OAuth app has a
  single callback URL. Either create a second "staging" OAuth app with
  `https://<name>.up.railway.app/api/auth/callback/github` and use its
  credentials while testing on the Railway domain, or skip GitHub sign-in until
  DNS has moved. The production app's callback stays
  `https://yourdomain.com/api/auth/callback/github`, so it needs no change if
  the domain stays the same.

### 4. Smoke test on the Railway domain

- ☐ Home page loads; play a guest quiz to the results page.
- ☐ Register with email/password → verification email arrives (Resend) → link
  signs you in.
- ☐ Sign out / sign in with email/password.
- ☐ Sign in with Google (and GitHub if you set up the staging app).
- ☐ Send the feedback form → email reaches `FEEDBACK_EMAIL`.
- ☐ Resend dashboard → Logs shows both sends as delivered.
- ☐ (If Sentry is configured) trigger an error and confirm it shows up with
  source maps.

### 5. DNS cutover

- ☐ A day ahead, lower the TTL on the app's records (e.g. 300s).
- ☐ Railway `web` → Settings → Networking → **Custom Domain** → add
  `yourdomain.com` (and `www` if used). Railway shows a CNAME target and a
  `_railway-verify` TXT record.
- ☐ At your DNS host, replace the Vercel records (`A 76.76.21.21` /
  `CNAME cname.vercel-dns.com`) with Railway's CNAME and add the TXT record. An
  apex domain needs a provider that supports CNAME flattening/ALIAS (e.g.
  Cloudflare). If the domain's **nameservers are Vercel's**, first recreate
  every record at the new DNS host, especially Resend's SPF/DKIM/MX records,
  then switch nameservers; otherwise email verification breaks.
- ☐ Wait for Railway to show the domain as verified with a certificate.
- ☐ Change `BETTER_AUTH_URL` and `ORIGIN` on `web` to `https://yourdomain.com`
  (Railway redeploys).
- ☐ Re-run the smoke test on the custom domain, including GitHub with the
  production OAuth app (switch `GITHUB_CLIENT_ID/SECRET` back if you used a
  staging app).

### 6. Cron services (optional)

For each of `cleanup-guests` and `populate-learning-resources`:

- ☐ New → GitHub Repo → same repo.
- ☐ Settings → **Config-as-code → Railway config file path**:
  `railway.cleanup-guests.json` or `railway.populate-learning-resources.json`.
- ☐ Variables: `DATABASE_URL=${{Postgres.DATABASE_URL}}`,
  `RAILPACK_NODE_VERSION=24`.
- ☐ Remove any public domain on the service; it serves no HTTP.

### 7. Turn off Vercel

Once the custom domain has served from Railway for a day or so without errors:

- ☐ Vercel project → Settings → Domains: remove the custom domain.
- ☐ Vercel project → Settings → Git: **Disconnect** the repository. This stops
  preview deployments and the Vercel status checks/comments on PRs.
- ☐ GitHub repo → Settings → Branches (or Rules): if a Vercel check is a
  required status check on `main`, remove it so PRs don't wait on it forever.
- ☐ GitHub → Settings → Applications → Vercel: remove this repo from the app's
  access (or uninstall it if nothing else uses it).
- ☐ Vercel project → Settings → Advanced → **Delete Project** (after copying any
  env values you still need; also delete any Vercel Postgres/Neon store only
  after confirming the data is in Railway).
- ☐ Locally, delete leftover Vercel build output:
  `rm -rf .vercel .svelte-kit/vercel-tmp`.

## Rollback

Until step 7, rolling back is a DNS change: point the records back at Vercel
and restore `BETTER_AUTH_URL` there. After a schema migration has run on the
Railway database, roll back the app only together with that database.
