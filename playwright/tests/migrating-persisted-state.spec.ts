import { test, expect } from '@playwright/test'
import { mockApi } from '../utils/mockApi'
import { warnSlowApi } from '../utils/warnSlowApi'
import { expectNoFatal } from '../utils/expectNoFatal'
import { addPersistedStorageV1, clearPersistedStorage } from '../utils/storage'
import { password, privateKeyUnlockedState } from '../../src/utils/__fixtures__/test-inputs'
import { RootState } from '../../src/types/RootState'

test.beforeEach(async ({ context, page }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
  await clearPersistedStorage(page, '/app.webmanifest')
})

test.afterEach(async ({ context }, testInfo) => {
  await expectNoFatal(context, testInfo)
})

test.describe('Migrating persisted state', () => {
  test('Decrypting V1 state should result in valid RootState', async ({ context, page }) => {
    await addPersistedStorageV1(page, '/app.webmanifest')
    await page.goto('/')
    await page.getByPlaceholder('Enter your password here').fill(password)
    await page.keyboard.press('Enter')

    const tab2 = await context.newPage()
    await tab2.goto('/e2e')
    await tab2.getByTestId('account-selector').click({ timeout: 15_000 })
    await expect(tab2.getByTestId('account-choice')).toHaveCount(1)
    const decryptedStateV1 = await tab2.evaluate(() => {
      const store: any = window['store']
      return store.getState() as RootState
    })
    expect(decryptedStateV1).toEqual({
      ...privateKeyUnlockedState,
      staking: {
        ...privateKeyUnlockedState.staking,
        validators: {
          ...privateKeyUnlockedState.staking.validators,
          timestamp: expect.any(Number),
        },
      },
      persist: {
        ...privateKeyUnlockedState.persist,
        stringifiedEncryptionKey: expect.any(String),
      },
    } satisfies RootState)
  })
})
