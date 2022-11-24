import type { Page } from '@playwright/test'
import { privateKeyPersistedState } from './test-inputs'

export async function clearPersistedStorage(page: Page) {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
}

export async function addPersistedStorage(page: Page) {
  await page.goto('/')
  await page.evaluate(
    ([privateKeyPersistedState]) => {
      window.localStorage.setItem('oasis_wallet_persist_v1', privateKeyPersistedState)
    },
    [privateKeyPersistedState],
  )
}
