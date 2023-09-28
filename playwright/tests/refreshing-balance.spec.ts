import { test, expect } from '@playwright/test'
import { privateKey, privateKeyAddress } from '../utils/test-inputs'
import { fillPrivateKeyWithoutPassword } from '../utils/fillPrivateKey'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'

test.beforeEach(async ({ page }) => {
  await warnSlowApi(page)
  await mockApi(page, 123)

  await page.goto('/open-wallet/private-key')
  await fillPrivateKeyWithoutPassword(page, {
    privateKey: privateKey,
    privateKeyAddress: privateKeyAddress,
    persistenceCheckboxChecked: false,
    persistenceCheckboxDisabled: false,
  })
  await expect(page.getByTestId('account-selector')).toBeVisible()
})

test('Account selector should refresh balances on network change', async ({ page }) => {
  await page.getByRole('link', { name: /Home/ }).click()

  await page.getByTestId('account-selector').click()
  await expect(page.getByTestId('account-choice')).toContainText('123.0')
  await page.getByRole('button', { name: /Select/ }).click()

  await mockApi(page, 456)
  await page.getByTestId('network-selector').click()
  await page.getByRole('menuitem', { name: 'Testnet' }).click()
  await page.getByTestId('account-selector').click()
  await expect(page.getByTestId('account-choice')).toContainText('456.0')
  await page.getByRole('button', { name: /Select/ }).click()
})
