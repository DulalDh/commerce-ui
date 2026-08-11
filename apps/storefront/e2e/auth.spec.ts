import { test, expect } from '@playwright/test';

test('home page renders the storefront shell', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Commerge' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Shop' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
});

test('login and register forms render without auth', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();

  await page.getByRole('link', { name: 'Create an account' }).click();
  await expect(page).toHaveURL(/\/register/);
  await expect(page.getByLabel('Full name')).toBeVisible();
});
