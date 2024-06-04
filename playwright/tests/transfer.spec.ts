import { test, expect } from '@playwright/test'
import { privateKey, privateKeyAddress } from '../../src/utils/__fixtures__/test-inputs'
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
    persistenceCheckboxDisabled: false,
  })
  await expect(page.getByTestId('account-selector')).toBeVisible()
})

test('Scrolling on amount input field should preserve value', async ({ page }) => {
  await page.getByTestId('nav-myaccount').click()

  const input = page.getByPlaceholder('Enter an amount')
  await input.click()
  await input.fill('1111')
  const inputPosition = await input.boundingBox()
  await page.mouse.move(
    inputPosition!.x + inputPosition!.width / 2,
    inputPosition!.y + inputPosition!.height / 2,
  )
  await page.mouse.wheel(0, 10)
  await page.mouse.wheel(0, 10)
  await page.mouse.wheel(0, 10)
  await expect(input).toHaveValue('1111')
})
