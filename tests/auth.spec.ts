import { expect, test } from '@playwright/test';

// A password that satisfies the app's rules: >= 12 chars, >= 4 unique chars,
// and no 3+ sequential digits.
const PASSWORD = 'SuperSecret!42';

function uniqueUser() {
  const id = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  return {
    name: `E2E User ${id}`.slice(0, 50),
    email: `e2e-${id}@example.com`,
    password: PASSWORD
  };
}

// The home page is prerendered, so its header can't reflect per-user auth state.
// We assert authentication via the dynamic, auth-gated /profile route instead.
async function expectAuthenticated(page: import('@playwright/test').Page) {
  await page.goto('/profile');
  await expect(page.getByRole('button', { name: 'Delete Account' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
}

test('register, logout, then log back in', async ({ page }) => {
  const user = uniqueUser();

  // --- Register ---
  await page.goto('/register');
  await page.getByLabel('Name').fill(user.name);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL('**/');

  // Registration auto-signs in.
  await expectAuthenticated(page);

  // --- Logout (button lives in the header on the authenticated /profile page) ---
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForURL('**/login');

  // Profile is now blocked.
  const blocked = await page.goto('/profile');
  expect(blocked?.status()).toBe(403);

  // --- Login ---
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/');

  await expectAuthenticated(page);
});

test('login with wrong password shows an error and stays logged out', async ({ page }) => {
  const user = uniqueUser();

  // Register first so the account exists, then log out (registration auto-signs
  // in, and the login page redirects away while authenticated).
  await page.goto('/register');
  await page.getByLabel('Name').fill(user.name);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL('**/');

  await page.goto('/profile');
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForURL('**/login');

  // Attempt login with the wrong password.
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill('WrongPassword!99');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('.error')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('registration is rejected for a too-short password', async ({ page }) => {
  const user = uniqueUser();

  await page.goto('/register');
  await page.getByLabel('Name').fill(user.name);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill('short'); // < 12 chars
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('.error')).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
});
