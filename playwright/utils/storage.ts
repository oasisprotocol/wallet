import type { Page } from '@playwright/test'
import { privateKeyPersistedState } from '../../src/utils/__fixtures__/test-inputs'

export async function clearPersistedStorage(page: Page) {
  // Move to the right domain, but don't needlessly load HTML and JS.
  await page.goto('/app.webmanifest')
  await page.evaluate(() => window.localStorage.clear())
}

export async function addPersistedStorage(page: Page) {
  // Move to the right domain, but don't needlessly load HTML and JS.
  await page.goto('/app.webmanifest')
  await page.evaluate(
    ([privateKeyPersistedState]) => {
      window.localStorage.setItem('oasis_wallet_persist_v1', privateKeyPersistedState)
    },
    [privateKeyPersistedState],
  )
}
