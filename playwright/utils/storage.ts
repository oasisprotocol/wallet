import type { Page } from '@playwright/test'
import {
  privateKeyPersistedState,
  walletExtensionV0PersistedState,
} from '../../src/utils/__fixtures__/test-inputs'

export async function clearPersistedStorage(
  page: Page,
  url: '/app.webmanifest' | `chrome-extension://${string}/manifest.json`,
) {
  // Move to the right domain, but don't needlessly load HTML and JS.
  await page.goto(url)
  await page.evaluate(() => {
    window.localStorage.clear()

    // v0 ext
    const chrome = (window as any).chrome
    chrome?.storage?.local?.clear(() => {})
    chrome?.extension?.getBackgroundPage?.().location.reload()
  })
}

export async function addPersistedStorageV1(
  page: Page,
  url: '/app.webmanifest' | `chrome-extension://${string}/manifest.json`,
) {
  // Move to the right domain, but don't needlessly load HTML and JS.
  await page.goto(url)
  await page.evaluate(
    ([privateKeyPersistedState]) => {
      window.localStorage.setItem('oasis_wallet_persist_v1', privateKeyPersistedState)
    },
    [privateKeyPersistedState],
  )
  await page.evaluate(() => {
    const chrome = (window as any).chrome
    chrome?.extension?.getBackgroundPage?.().location.reload()
  })
}

export async function addPersistedStorageV0(page: Page, url: `chrome-extension://${string}/manifest.json`) {
  // Move to the right domain, but don't needlessly load HTML and JS.
  await page.goto(url)
  await page.evaluate(
    ([state]) => {
      const chrome = (window as any).chrome
      chrome.storage.local.set(state.chromeStorageLocal, () => {})

      const { ADDRESS_BOOK_CONFIG, LANGUAGE_CONFIG, NETWORK_CONFIG, DISMISSED_NEW_EXTENSION_WARNING } =
        state.localStorage
      window.localStorage.removeItem('ADDRESS_BOOK_CONFIG')
      ADDRESS_BOOK_CONFIG && window.localStorage.setItem('ADDRESS_BOOK_CONFIG', ADDRESS_BOOK_CONFIG)
      window.localStorage.removeItem('LANGUAGE_CONFIG')
      LANGUAGE_CONFIG && window.localStorage.setItem('LANGUAGE_CONFIG', LANGUAGE_CONFIG)
      window.localStorage.removeItem('NETWORK_CONFIG')
      NETWORK_CONFIG && window.localStorage.setItem('NETWORK_CONFIG', NETWORK_CONFIG)
      window.localStorage.removeItem('DISMISSED_NEW_EXTENSION_WARNING')
      DISMISSED_NEW_EXTENSION_WARNING &&
        window.localStorage.setItem('DISMISSED_NEW_EXTENSION_WARNING', DISMISSED_NEW_EXTENSION_WARNING)

      chrome.extension.getBackgroundPage().location.reload()
    },
    [walletExtensionV0PersistedState],
  )
}
