import type { PlaywrightTestConfig } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// Env passed to the build + preview server. DATABASE_URL is taken from the
// surrounding shell (CI service / local throwaway DB) so e2e never touches a
// real database. Dummy OAuth credentials let BetterAuth build provider
// authorize URLs without contacting the real providers.
const webServerEnv: Record<string, string> = {
  ...process.env,
  DATABASE_URL:
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:55432/appdb?schema=public',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? 'e2e-test-secret-change-me',
  BETTER_AUTH_URL: BASE_URL,
  ORIGIN: BASE_URL,
  // Disable BetterAuth rate limiting for the suite (kept on in real production).
  AUTH_DISABLE_RATE_LIMIT: 'true',
  PUBLIC_SENTRY_DSN: process.env.PUBLIC_SENTRY_DSN ?? '',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? 'e2e-github-client-id',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? 'e2e-github-client-secret',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? 'e2e-google-client-id',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? 'e2e-google-client-secret'
};

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run build && npm run preview',
    port: PORT,
    env: webServerEnv,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  },
  use: {
    baseURL: BASE_URL
  },
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
