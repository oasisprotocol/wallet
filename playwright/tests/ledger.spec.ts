import { test, expect } from '@playwright/test'
import { expectNoErrorsInConsole } from '../utils/expectNoErrorsInConsole'

test.describe('Ledger', () => {
  test('Permissions-Policy should allow USB', async ({ page, context }) => {
    expect((await page.request.head('/')).headers()).toHaveProperty('permissions-policy')
    await expectNoErrorsInConsole(page)

    await page.goto('/open-wallet')
    await page.getByRole('button', { name: /Ledger/i }).click()
    await page.getByRole('button', { name: /USB Ledger/i }).click()
    await page.getByRole('button', { name: 'Select accounts to open' }).click()

    await expect(page.getByText('error').or(page.getByText('fail'))).toBeHidden()
  })
})
