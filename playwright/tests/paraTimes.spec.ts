import { test, expect } from '@playwright/test'
import { privateKey, privateKeyAddress } from '../../src/utils/__fixtures__/test-inputs'
import { fillPrivateKeyWithoutPassword } from '../utils/fillPrivateKey'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'

test.beforeEach(async ({ page }) => {
  await warnSlowApi(page)
  await mockApi(page, 500000000000)
})

test.describe('ParaTimes', () => {
  test('should clear form data on cancel transfer', async ({ page }) => {
    await page.goto('/open-wallet/private-key')
    await fillPrivateKeyWithoutPassword(page, {
      privateKey: privateKey,
      privateKeyAddress: privateKeyAddress,
      persistenceCheckboxChecked: false,
      persistenceCheckboxDisabled: false,
    })
    await page.getByTestId('nav-paratime').click()
    await page.getByRole('button', { name: /Deposit/i }).click()
    await page.getByRole('button', { name: /Select/i }).click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await page.getByRole('listbox').locator('button', { hasText: 'Cipher' }).click()
    await page.getByRole('button', { name: /Next/i }).click()
    await page.getByPlaceholder(privateKeyAddress).fill(privateKeyAddress)
    await page.getByRole('button', { name: /Cancel transfer/i }).click()
    await page.getByRole('button', { name: /Deposit/i }).click()
    await page.getByRole('button', { name: /Select/i }).click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await page.getByRole('listbox').locator('button', { hasText: 'Emerald' }).click()
    await page.getByRole('button', { name: /Next/i }).click()
    await expect(page.getByPlaceholder('0x...')).toHaveValue('')
  })
})
