import { test } from '../utils/extensionTestExtend'
import { expect } from '@playwright/test'
import { mockApi } from '../utils/mockApi'
import { warnSlowApi } from '../utils/warnSlowApi'
import { expectNoFatal } from '../utils/expectNoFatal'
import { addPersistedStorageV0, clearPersistedStorage } from '../utils/storage'
import { password, walletExtensionV0UnlockedState } from '../../src/utils/__fixtures__/test-inputs'
import { RootState } from '../../src/types/RootState'

test.beforeEach(async ({ context, page, extensionManifestURL }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
  await clearPersistedStorage(page, extensionManifestURL)
})

test.afterEach(async ({ context }, testInfo) => {
  await expectNoFatal(context, testInfo)
})

test('Migrate from V0 extension persisted state to valid RootState', async ({
  context,
  page,
  extensionPopupURL,
  extensionManifestURL,
}) => {
  await test.step('start migration', async () => {
    await addPersistedStorageV0(page, extensionManifestURL)
    await page.goto(`${extensionPopupURL}/`)
    await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
    await page.keyboard.press('Enter')
  })

  await test.step('should warn about fields lost in migration', async () => {
    // await expect(page).toHaveScreenshot({ fullPage: true })
    await page.getByRole('button', { name: /Tap to show/ }).click()
    await expect(
      page.getByText(
        'among scrap refuse hungry remove unhappy crack horn half cruel skull project dentist poet design paper eternal stool tomato cabin helmet funny victory happy',
      ),
    ).toBeVisible()
    await page.getByText('I’ve safely stored my mnemonic').check()
    await page.getByRole('button', { name: /Next/ }).click({ timeout: 8000 })

    // await expect(page).toHaveScreenshot({ fullPage: true })
    await page.getByRole('button', { name: /Tap to show/ }).click()
    await expect(
      page.getByText(
        'Grm/Vg1MpARPMbmdpExVA9Dkj1CMiSzYLFxKnPx20fs+OnxH8YpntwQQEF2URHZiabsaHkGLHN86arqPGJI9Og==',
      ),
    ).toBeVisible()
    await page.getByText('I’ve safely stored my private keys').check()
    await page.getByRole('button', { name: /Open the new version of the wallet/ }).click({ timeout: 8000 })
  })

  await test.step('should result in valid RootState', async () => {
    const tab2 = await context.newPage()
    await tab2.goto(`${extensionPopupURL}/e2e`)
    await tab2.getByTestId('account-selector').click({ timeout: 15_000 })
    await expect(tab2.getByTestId('account-choice')).toHaveCount(7)
    const decryptedStateV1 = await tab2.evaluate(() => {
      const store: any = window['store']
      return store.getState() as RootState
    })
    expect(decryptedStateV1).toEqual({
      ...walletExtensionV0UnlockedState,

      // TODO: fix mockApi inside extension tests to get consistent responses
      // https://github.com/oasisprotocol/oasis-wallet-web/issues/1770
      account: expect.any(Object),
      network: expect.any(Object),
      staking: expect.any(Object),

      persist: {
        ...walletExtensionV0UnlockedState.persist,
        stringifiedEncryptionKey: expect.any(String),
      },
    } satisfies RootState)
  })
})
