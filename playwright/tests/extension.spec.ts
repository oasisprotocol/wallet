import { test as base, expect, BrowserContext, chromium } from '@playwright/test'
import path from 'path'

import extensionManifest from '../../build-dev/manifest.json'
const pathToExtension = path.join(__dirname, '../../build-dev')
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
      args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
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

test.describe('The extension homepage should load', () => {
  test('should have options to open the wallet', async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/${popupFile}`)
    await expect(page.getByRole('link', { name: /Open wallet/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Create wallet/i })).toBeVisible()
  })
})
