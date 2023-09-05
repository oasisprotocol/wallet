import { test as base, expect, BrowserContext, chromium } from '@playwright/test'
import path from 'path'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'
import { expectNoErrorsInConsole } from '../utils/expectNoErrorsInConsole'
import { fillPrivateKeyWithoutPassword } from '../utils/fillPrivateKey'
import { privateKey, privateKeyAddress } from '../utils/test-inputs'

// Test dev build by default, but also allow testing production
const extensionPath = path.join(__dirname, '..', process.env.EXTENSION_PATH ?? '../build-dev/')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const extensionManifest = require(path.join(extensionPath, '/manifest.json'))
const popupFile = extensionManifest.browser_action.default_popup

// From https://playwright.dev/docs/chrome-extensions
export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    })
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    // for manifest v2:
    let [background] = context.backgroundPages()
    if (!background) background = await context.waitForEvent('backgroundpage')

    // for manifest v3:
    // let [background] = context.serviceWorkers()
    // if (!background) background = await context.waitForEvent('serviceworker')

    const extensionId = background.url().split('/')[2]
    await use(extensionId)
  },
})

test.beforeEach(async ({ context }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
})

test.describe('The extension popup should load', () => {
  test('should successfully load javascript chunks', async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/${popupFile}`)
    await expect(page.getByRole('link', { name: /Open wallet/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Create wallet/i })).toBeVisible()
  })

  test('get state from background page through webext-redux', async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/${popupFile}`)
    await page.getByRole('button', { name: /Dark mode/i }).click()
    await page.getByRole('button', { name: /Light mode/i }).click()

    await page.getByRole('link', { name: /Create wallet/i }).click()
    await expect(page.getByTestId('mnemonic-grid').locator('> *')).toHaveCount(24)
  })

  test('ask for USB permissions in ledger popup', async ({ page, context, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/${popupFile}#/open-wallet`)
    await page.getByRole('button', { name: /Ledger/i }).click()
    const popupPromise = context.waitForEvent('page')
    await page.getByRole('button', { name: /Grant access to your Ledger/i }).click()
    const popup = await popupPromise
    await popup.waitForLoadState()
    await popup.getByRole('button', { name: /Connect Ledger device/i }).click()
    await popup.waitForTimeout(100)
    // Expect not to crash, nor auto-reject permissions dialog
    await expect(popup.getByText('error').or(popup.getByText('fail'))).toBeHidden()
  })

  test('should allow embedded Transak widget', async ({ page, extensionId }) => {
    await expectNoErrorsInConsole(page, {
      ignoreError: msg => {
        // Odd errors inside Transak
        if (msg.text().includes('responded with a status of 403')) return true
        if (msg.text().includes('`sessionKey` is a required property')) return true
      },
    })
    await page.goto(`chrome-extension://${extensionId}/${popupFile}#/open-wallet/private-key`)
    await fillPrivateKeyWithoutPassword(page, {
      privateKey: privateKey,
      privateKeyAddress: privateKeyAddress,
      persistenceCheckboxChecked: false,
      persistenceCheckboxDisabled: false,
    })
    await expect(page.getByTestId('account-selector')).toBeVisible()
    await page.getByRole('link', { name: 'Buy' }).click()
    await expect(page.getByRole('heading', { name: 'Buy ROSE' })).toBeVisible()

    await page
      .getByText(
        'I understand that I’m using a third-party solution and Oasis* does not carry any responsibility over the usage of this solution.',
      )
      .click()
    await expect(page.frameLocator('iframe')!.getByAltText('Powered by Transak')).toBeVisible()
    await page.frameLocator('iframe')!.getByText('Buy now').click()
    await expect(page.frameLocator('iframe')!.getByText('Please Enter Your Email')).toBeVisible()
  })
})
