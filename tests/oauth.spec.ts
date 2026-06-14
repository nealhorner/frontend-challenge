import { expect, test } from '@playwright/test';

// Each social provider's authorize endpoint. Completing a real OAuth handshake
// needs the actual provider, so e2e validates that BetterAuth is correctly
// wired up to the point of redirecting to the right provider.
const PROVIDERS = [
  { provider: 'github', authorizeHost: 'github.com', authorizePath: '/login/oauth/authorize' },
  { provider: 'google', authorizeHost: 'accounts.google.com', authorizePath: '/o/oauth2' }
] as const;

for (const { provider, authorizeHost, authorizePath } of PROVIDERS) {
  test(`${provider} sign-in produces a valid OAuth authorize redirect`, async ({ request }) => {
    const res = await request.post('/api/auth/sign-in/social', {
      data: { provider, callbackURL: '/' }
    });

    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { url?: string };
    expect(body.url, `expected a redirect url for ${provider}`).toBeTruthy();

    const url = new URL(body.url as string);
    expect(url.host).toBe(authorizeHost);
    expect(url.pathname).toContain(authorizePath);
    // OAuth state must be present for CSRF protection on the callback.
    expect(url.searchParams.get('state')).toBeTruthy();
    expect(url.searchParams.get('client_id')).toBeTruthy();
  });
}

test('social login buttons render on the login and register pages', async ({ page }) => {
  for (const path of ['/login', '/register']) {
    await page.goto(path);
    await expect(page.locator('[data-provider="github"]')).toBeVisible();
    await expect(page.locator('[data-provider="google"]')).toBeVisible();
  }
});
