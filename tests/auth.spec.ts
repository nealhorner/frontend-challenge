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

test('register, logout, then log back in', async ({ page }) => {
  const user = uniqueUser();

  // --- Register ---
  await page.goto('/register');
  await page.getByLabel('Name').fill(user.name);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Register' }).click();

  // Lands on the home page, authenticated (Logout + Profile visible in header).
  await page.waitForURL('**/');
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();

  // --- Logout ---
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForURL('**/login');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

  // --- Login ---
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('**/');
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});

test('login with wrong password shows an error and stays logged out', async ({ page }) => {
  const user = uniqueUser();

  // Register first so the account exists.
  await page.goto('/register');
  await page.getByLabel('Name').fill(user.name);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL('**/');
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
