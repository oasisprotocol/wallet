import { test } from '@playwright/test'
import { warnSlowApi } from '../utils/warnSlowApi'

test.beforeEach(async ({ page }) => {
  await warnSlowApi(page)
})

test('warnSlowApi should not throw if test ends before it measures response time', async ({ page }) => {
  await page.goto('/open-wallet/private-key', { waitUntil: 'domcontentloaded' })
})
