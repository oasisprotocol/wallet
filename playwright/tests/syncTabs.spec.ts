import { test, expect, Page } from '@playwright/test'
import { mockApi } from '../utils/mockApi'
import { warnSlowApi } from '../utils/warnSlowApi'
import { expectNoFatal } from '../utils/expectNoFatal'
import { privateKey, password, privateKeyAddress } from '../utils/test-inputs'
import { addPersistedStorage, clearPersistedStorage } from '../utils/storage'

test.beforeEach(async ({ context, page }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
  await clearPersistedStorage(page)
})

test.afterEach(async ({ context }, testInfo) => {
  await expectNoFatal(context, testInfo)
})

test.describe('syncTabs', () => {
  test.describe('lock second tab after locking wallet', () => {
    test('unpersisted', async ({ page, context }) => {
      await page.goto('/open-wallet/private-key')
      await page.getByPlaceholder('Enter your private key here').fill(privateKey)
      await page.keyboard.press('Enter')
      await expect(page.getByText('Loading account')).toBeVisible()
      await expect(page.getByText('Loading account')).toBeHidden()
      await expect(page.getByTestId('account-selector')).toBeVisible()
      await expect(page).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))

      const tab2 = await context.newPage()
      await testLockingIsSynced(page, tab2)
    })

    test('persisted', async ({ page, context }) => {
      await page.goto('/open-wallet/private-key')
      await page.getByPlaceholder('Enter your private key here').fill(privateKey)
      await page.getByText('Store private keys locally, protected by a password').check()
      await page.getByPlaceholder('Enter your password here').fill(password)
      await page.getByPlaceholder('Re-enter your password').fill(password)
      await page.keyboard.press('Enter')
      await expect(page.getByText('Loading account')).toBeVisible()
      await expect(page.getByText('Loading account')).toBeHidden()
      await expect(page.getByTestId('account-selector')).toBeVisible()
      await expect(page).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))

      const tab2 = await context.newPage()
      await testLockingIsSynced(page, tab2)
      await expect(page.getByRole('button', { name: 'Unlock' })).toBeVisible()
      await expect(tab2.getByRole('button', { name: 'Unlock' })).toBeVisible()
    })

    test('incognito', async ({ page, context }) => {
      await addPersistedStorage(page)
      await page.goto('/')
      await page.getByRole('button', { name: 'Continue without the profile' }).click()
      await expect(page.getByTestId('account-selector')).toBeHidden()

      const tab2 = await context.newPage()
      await tab2.goto('/')
      await expect(tab2.getByRole('button', { name: 'Unlock' })).toBeHidden()
      await tab2.goto('/open-wallet/private-key')
      await tab2.getByPlaceholder('Enter your private key here').fill(privateKey)
      await tab2.keyboard.press('Enter')
      await expect(tab2.getByTestId('account-selector')).toBeVisible()
      await expect(page.getByTestId('account-selector')).toBeVisible()

      await testLockingIsSynced(page, tab2)
      await expect(page.getByRole('button', { name: 'Unlock' })).toBeVisible()
      await expect(tab2.getByRole('button', { name: 'Unlock' })).toBeVisible()
    })

    async function testLockingIsSynced(page: Page, tab2: Page) {
      // Second tab should sync the opened wallet
      await tab2.goto('/')
      await expect(tab2.getByTestId('account-selector')).toBeVisible()
      await tab2.getByRole('link', { name: 'Wallet' }).click()
      await expect(tab2).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))

      // Second tab should not get stuck on loading after first tab closes wallet
      await page.getByRole('button', { name: /(Close wallet)|(Lock profile)/ }).click()
      await expect(page.getByText('Loading account')).toBeHidden()
      await expect(page.getByTestId('account-selector')).toBeHidden()
      await expect(tab2.getByText('Loading account')).toBeHidden()
      await expect(tab2.getByTestId('account-selector')).toBeHidden()
    }
  })
})
