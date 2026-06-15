import { describe, it, expect, vi } from 'vitest';

// auth.ts pulls getRequestEvent from $app/server, which is only meaningful in a
// request context. Stub it so the config can be imported in isolation.
vi.mock('$app/server', () => ({
  getRequestEvent: () => ({})
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

  it('wires up GitHub and Google social providers', () => {
    const providers = auth.options.socialProviders ?? {};
    expect(Object.keys(providers).sort()).toEqual(['github', 'google']);
  });

  it('registers the anonymous (guest) plugin', () => {
    const pluginIds = (auth.options.plugins ?? []).map((p) => p.id);
    expect(pluginIds).toContain('anonymous');
  });
});
