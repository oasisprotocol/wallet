import { test, expect } from '@playwright/test'
import { mockApi } from '../utils/mockApi'
import { warnSlowApi } from '../utils/warnSlowApi'
import { expectNoFatal } from '../utils/expectNoFatal'
import { addPersistedStorage, clearPersistedStorage } from '../utils/storage'
import { password, privateKeyUnlockedState } from '../../src/utils/__fixtures__/test-inputs'
import { RootState } from '../../src/types/RootState'

test.beforeEach(async ({ context, page }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
  await clearPersistedStorage(page)
})

test.afterEach(async ({ context }, testInfo) => {
  await expectNoFatal(context, testInfo)
})

test.describe('Migrating persisted state', () => {
  test('Decrypting V1 state should result in valid RootState', async ({ context, page }) => {
    await addPersistedStorage(page)
    await page.goto('/')
    await page.getByPlaceholder('Enter your password here').fill(password)
    await page.keyboard.press('Enter')

    const tab2 = await context.newPage()
    await tab2.goto('/e2e')
    const decryptedStateV1 = await tab2.evaluate(() => {
      const store: any = window['store']
      return store.getState() as RootState
    })
    expect(decryptedStateV1).toEqual({
      ...privateKeyUnlockedState,
      persist: {
        ...privateKeyUnlockedState.persist,
        stringifiedEncryptionKey: expect.any(String),
      },
    } satisfies RootState)
  })
})
