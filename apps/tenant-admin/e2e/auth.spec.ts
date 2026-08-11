import { test, expect } from '@playwright/test';

test('unauthenticated visitor is redirected to login', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: 'Sign in to your store' })).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('register link navigates to the registration form', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page).toHaveURL(/\/register/);
  await expect(page.getByLabel('Store name')).toBeVisible();
  await expect(page.getByLabel('Store type')).toBeVisible();
});
