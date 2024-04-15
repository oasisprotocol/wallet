import { test, expect } from '@playwright/test'
import { privateKey, privateKeyAddress, ethAccount } from '../../src/utils/__fixtures__/test-inputs'
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
    await page.getByRole('button', { name: /Select a ParaTime/i }).click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await page.getByRole('listbox').locator('button', { hasText: 'Cipher' }).click()
    await page.getByRole('button', { name: /Next/i }).click()
    await page.getByPlaceholder(privateKeyAddress).fill(privateKeyAddress)
    await page.getByRole('button', { name: /Cancel transfer/i }).click()
    await page.getByRole('button', { name: /Deposit/i }).click()
    await page.getByRole('button', { name: /Select a ParaTime/i }).click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await page.getByRole('listbox').locator('button', { hasText: 'Emerald' }).click()
    await page.getByRole('button', { name: /Next/i }).click()
    await expect(page.getByPlaceholder('0x...')).toHaveValue('')
  })

  test('should validate eth private key', async ({ page }) => {
    const validKey = ethAccount.privateKey
    const validKeyWithPrefix = `0x${validKey}`
    const invalidKey = validKey.replace('c', 'g')
    const invalidKeyWithPrefix = `0x${invalidKey}`

    async function testPrivateKeyValidation(key, expected) {
      await page.getByPlaceholder('Enter Ethereum-compatible private key').fill(key)
      await page.getByRole('button', { name: 'Next' }).click()
      await expect(page.getByText(expected)).toBeVisible()
    }

    await page.goto('/open-wallet/private-key')
    await fillPrivateKeyWithoutPassword(page, {
      privateKey: privateKey,
      privateKeyAddress: privateKeyAddress,
      persistenceCheckboxChecked: false,
      persistenceCheckboxDisabled: false,
    })
    await page.getByTestId('nav-paratime').click()
    await page.getByRole('button', { name: /Withdraw/i }).click()
    await page.getByRole('button', { name: 'Select a ParaTime' }).click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await page.getByRole('listbox').locator('button', { hasText: 'Sapphire' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByPlaceholder(privateKeyAddress).fill(privateKeyAddress)
    // valid eth private keys
    await testPrivateKeyValidation(validKey, /enter the amount/)
    await page.getByRole('button', { name: 'Back' }).click()
    await testPrivateKeyValidation(validKeyWithPrefix, /enter the amount/)
    await page.getByRole('button', { name: 'Back' }).click()
    // invalid eth private keys
    await testPrivateKeyValidation(invalidKey, /private key is invalid/)
    await testPrivateKeyValidation(invalidKeyWithPrefix, /private key is invalid/)
  })
})
