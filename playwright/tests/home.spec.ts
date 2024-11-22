import { test, expect } from '@playwright/test'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'

test.beforeEach(async ({ context }) => {
  await warnSlowApi(context)
  await mockApi(context, '0')
})

test.describe('The homepage should load', () => {
  test('should have options to open the wallet', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /Open wallet/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Create wallet/i })).toBeVisible()
  })
})
