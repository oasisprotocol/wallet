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

  /**
   * Extension should be able to show embedded Transak, but we currently link to
   * it instead. Ext popup is too small and loses all progress when it closes.
   */
  test('Transak can not be embedded in extension', async ({ page, extensionPopupURL }) => {
    test.fail()

    /* TODO: reenable when transak throws only a few errors
    await expectNoErrorsInConsole(page, {
      ignoreError: msg => {
        // Odd errors inside Transak
        if (msg.text().includes('responded with a status of 403')) return true
        if (msg.text().includes('`sessionKey` is a required property')) return true
        if (msg.text().includes('[Report Only]')) return true
        if (msg.text().includes('script-src https://*.transak.com https://*.google.com')) return true
      },
    })
    */
    await page.goto(`${extensionPopupURL}/`)
    await page.evaluate(() => {
      const iframe = document.createElement('iframe')
      iframe.src = 'https://global.transak.com'
      document.body.appendChild(iframe)
    })
    await page.locator('iframe').scrollIntoViewIfNeeded()
    await expect(page.frameLocator('iframe')!.getByAltText('Powered by Transak')).toBeVisible()
  })

  test('recover from fatal errors', async ({ extensionPopupURL, context }) => {
    {
      const page = await context.newPage()
      await page.goto(`${extensionPopupURL}/e2e`)
      expect(page.getByRole('button', { name: 'Trigger fatal saga error' })).toBeVisible() // Was built with REACT_APP_E2E_TEST=1?
      await page.getByRole('button', { name: 'Trigger fatal saga error' }).click()
      await expect(page.getByTestId('fatalerror-stacktrace')).toBeVisible()

      // Gets unstuck with a button
      await page
        .getByRole('button', { name: 'Reload app' })
        .click()
        .catch(e => {
          // Ignore error. Reloading extension's runtime auto-closes its popups.
          expect(e.toString()).toContain('Target page, context or browser has been closed')
        })
      await page.close()
    }

    {
      const page = await context.newPage()
      await page.waitForTimeout(1000)
      await page.goto(`${extensionPopupURL}/`)
      await expect(page.getByTestId('fatalerror-stacktrace')).toBeHidden()
      await page.reload()
      await expect(page.getByTestId('fatalerror-stacktrace')).toBeHidden()
      await page.close()
    }
  })
})
