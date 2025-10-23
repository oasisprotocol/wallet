import { test } from '../utils/extensionTestExtend'
import { expect } from '@playwright/test'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'

test.beforeEach(async ({ context }) => {
  await warnSlowApi(context)
  await mockApi(context, '0')
})

test.describe('The extension popup should load', () => {
  test('should successfully load javascript chunks', async ({ page, extensionPopupURL }) => {
    await page.goto(`${extensionPopupURL}/`)
    await expect(page.getByRole('link', { name: /Open wallet/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Create wallet/i })).toBeVisible()
  })

  test('saga is initialized', async ({ page, extensionPopupURL }) => {
    await page.goto(`${extensionPopupURL}/`)
    await page.getByRole('button', { name: /Menu/i }).click()
    await page.getByRole('button', { name: /Dark mode/i }).click()
    await page.getByRole('button', { name: /Light mode/i }).click()
    await page.getByRole('link', { name: /Home/i }).click()

    await page.getByRole('link', { name: /Create wallet/i }).click()
    await page.getByRole('button', { name: /Generate a new mnemonic/i }).click()
    await expect(page.getByTestId('generated-mnemonic')).toHaveText(/\w+(\s\w+){23}/)
  })

  test('ask for USB permissions in ledger popup', async ({ page, context, extensionPopupURL }) => {
    await page.goto(`${extensionPopupURL}/open-wallet`)
    const popupPromise = context.waitForEvent('page')
    await page.getByRole('button', { name: /Ledger/i }).click()
    await page.getByRole('button', { name: /Grant access to your USB Ledger/i }).click()
    const popup = await popupPromise
    await popup.waitForLoadState()
    await popup.getByRole('button', { name: /Connect Ledger device/i }).click()
    await popup.waitForTimeout(100)
    // Expect not to crash, nor auto-reject permissions dialog
    await expect(popup.getByText('error').or(popup.getByText('fail'))).toBeHidden()
  })
})
