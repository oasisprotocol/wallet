import { test as base, expect, BrowserContext, chromium } from '@playwright/test'
import path from 'path'

// From https://playwright.dev/docs/chrome-extensions
export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, 'my-extension')
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
    })
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    /*
    // for manifest v2:
    let [background] = context.backgroundPages()
    if (!background)
      background = await context.waitForEvent("backgroundpage")
    */

    // for manifest v3:
    let [background] = context.serviceWorkers()
    if (!background) background = await context.waitForEvent('serviceworker')

    const extensionId = background.url().split('/')[2]
    await use(extensionId)
  },
})

test('popup page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`)
  await expect(page.locator('body')).toHaveText('my-extension popup')
})
