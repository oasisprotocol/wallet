import { test, expect } from '@playwright/test'
import { reactErrorOverlay } from '../../internals/getSecurityHeaders.js'
import { expectNoErrorsInConsole } from '../utils/expectNoErrorsInConsole'

test('Dev Content-Security-Policy should allow react-error-overlay', async ({ page, baseURL }) => {
  if (baseURL !== 'http://localhost:3000') test.skip()
  expect((await page.request.head('/')).headers()).toHaveProperty('content-security-policy')
  expect((await page.request.head('/')).headers()['content-security-policy']).toContain(reactErrorOverlay)
  await page.goto('/e2e')
  await page.getByRole('button', { name: 'Trigger uncaught error' }).click()
  await expectNoErrorsInConsole(page)
  await expect(page.locator('iframe')).toBeVisible()
  await expect(page.frameLocator('iframe').getByText('ReferenceError')).toBeVisible()
})
