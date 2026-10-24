import { describe, it, expect, vi } from 'vitest';

// auth.ts pulls getRequestEvent from $app/server, which is only meaningful in a
// request context. Stub it so the config can be imported in isolation.
vi.mock('$app/server', () => ({
  getRequestEvent: () => ({})
}));

// auth.ts reads its settings from Varlock's ENV (see .env.schema). Provide
// test values, including credentials for both social providers.
vi.mock('varlock/env', async (importOriginal) => ({
  // Keep the real exports (the Varlock Vite plugin calls initVarlockEnv)
  ...(await importOriginal<typeof import('varlock/env')>()),
  ENV: {
    // prisma.ts reads this at import; the test never connects
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    BETTER_AUTH_URL: 'http://localhost:5173',
    BETTER_AUTH_SECRET: 'test-secret-test-secret-test-secret-123',
    REQUIRE_EMAIL_VERIFICATION: true,
    AUTH_DISABLE_RATE_LIMIT: false,
    GITHUB_CLIENT_ID: 'gh-id',
    GITHUB_CLIENT_SECRET: 'gh-secret',
    GOOGLE_CLIENT_ID: 'g-id',
    GOOGLE_CLIENT_SECRET: 'g-secret'
  }
}));

import { auth } from './auth';

describe('BetterAuth configuration', () => {
  it('enables email/password authentication', () => {
    expect(auth.options.emailAndPassword?.enabled).toBe(true);
  });

  it('uses a custom (Argon2) password hasher for legacy-hash compatibility', () => {
    expect(typeof auth.options.emailAndPassword?.password?.hash).toBe('function');
    expect(typeof auth.options.emailAndPassword?.password?.verify).toBe('function');
  });

  it('reads the base URL from the environment', () => {
    expect(auth.options.baseURL).toBe('http://localhost:5173');
  });

  it('wires up GitHub and Google social providers when configured', () => {
    const providers = auth.options.socialProviders ?? {};
    expect(Object.keys(providers).sort()).toEqual(['github', 'google']);
  });

  it('registers the anonymous (guest) plugin', () => {
    const pluginIds = (auth.options.plugins ?? []).map((p) => p.id);
    expect(pluginIds).toContain('anonymous');
  });
});
