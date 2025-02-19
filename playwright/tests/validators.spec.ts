import { test, expect } from '@playwright/test'
import { privateKey, privateKeyAddress } from '../../src/utils/__fixtures__/test-inputs'
import { fillPrivateKeyWithoutPassword } from '../utils/fillPrivateKey'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'
import { expectNoErrorsInConsole } from '../utils/expectNoErrorsInConsole'

test.beforeEach(async ({ page }) => {
  await warnSlowApi(page)
  await mockApi(page, '500000000000')
  // Unmock validators list API
  await page.unroute('**/consensus/validators?*')
  await expectNoErrorsInConsole(page, {
    ignoreError: message => {
      // Some validator icons need authentication
      if (message.text().includes('status of 403')) return true
    },
  })

  await page.goto('/open-wallet/private-key')
  await fillPrivateKeyWithoutPassword(page, {
    privateKey: privateKey,
    privateKeyAddress: privateKeyAddress,
    persistenceCheckboxDisabled: false,
  })
  await expect(page.getByTestId('account-selector')).toBeVisible()
})

test.describe('Validators', () => {
  test('Content-Security-Policy should allow validator icons', async ({ page }) => {
    expect((await page.request.head('/')).headers()).toHaveProperty('content-security-policy')

    const someValidatorIconPromise = page.waitForResponse(
      response =>
        response.url().startsWith('https://s3.amazonaws.com/keybase_processed_uploads/') &&
        response.status() === 200,
    )

    await page.getByRole('link', { name: 'Stake' }).click()
    // Wait for validators to be shown, then scroll to them to trigger lazy loading.
    await expect(page.getByText('stakefish')).toBeVisible()
    await page.getByText('stakefish').scrollIntoViewIfNeeded()
    await (await someValidatorIconPromise).finished()
    // Expect no errors.
  })
})
