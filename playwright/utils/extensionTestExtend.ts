import { test as base, BrowserContext, chromium } from '@playwright/test'
import path from 'path'

// Test dev build by default, but also allow testing production
const extensionPath = path.join(__dirname, '..', process.env.EXTENSION_PATH ?? '../build-dev/')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const extensionManifest = require(path.join(extensionPath, '/manifest.json'))
const popupFile = extensionManifest.browser_action.default_popup

// From https://playwright.dev/docs/chrome-extensions
export const test = base.extend<{
  context: BrowserContext
  extensionId: string
  extensionPopupURL: `chrome-extension://${string}`
  extensionManifestURL: `chrome-extension://${string}/manifest.json`
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
  extensionPopupURL: async ({ extensionId }, use) => {
    await use(`chrome-extension://${extensionId}/${popupFile}#`)
  },
  extensionManifestURL: async ({ extensionId }, use) => {
    await use(`chrome-extension://${extensionId}/manifest.json`)
  },
})
