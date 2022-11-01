import { test, expect } from '@playwright/test'

test.describe('The homepage should load', () => {
  test('should have options to open the wallet', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /Open wallet/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Create wallet/i })).toBeVisible()
  })
})
