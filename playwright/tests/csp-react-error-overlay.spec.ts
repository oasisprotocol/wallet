import { test, expect } from '@playwright/test'
import { expectNoErrorsInConsole } from '../utils/expectNoErrorsInConsole'

test('Dev Content-Security-Policy should allow @parcel/error-overlay', async ({ page, baseURL }) => {
  if (baseURL !== 'http://localhost:3000') test.skip()
  expect((await page.request.head('/')).headers()).toHaveProperty('content-security-policy')
  await page.goto('/e2e')
  await page.getByRole('button', { name: 'Trigger uncaught error' }).click()
  await expectNoErrorsInConsole(page)
  await expect(page.getByText('ReferenceError')).toBeVisible({ timeout: 30_000 })
})
