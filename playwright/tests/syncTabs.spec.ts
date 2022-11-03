import { test, expect, Page } from '@playwright/test'
import { mockApi } from '../utils/mockApi'
import { warnSlowApi } from '../utils/warnSlowApi'
import { expectNoFatal } from '../utils/expectNoFatal'
import { password, privateKeyAddress } from '../utils/test-inputs'
import { addPersistedStorage, clearPersistedStorage } from '../utils/storage'
import { fillPrivateKeyWithoutPassword, fillPrivateKeyAndPassword } from '../utils/fillPrivateKey'

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
      await fillPrivateKeyWithoutPassword(page, {
        persistenceCheckboxChecked: false,
        persistenceCheckboxDisabled: false,
      })
      await expect(page.getByTestId('account-selector')).toBeVisible()

      const tab2 = await context.newPage()
      await testLockingIsSynced(page, tab2)
    })

    test('persisted', async ({ page, context }) => {
      await page.goto('/open-wallet/private-key')
      await fillPrivateKeyAndPassword(page)
      await expect(page.getByTestId('account-selector')).toBeVisible()

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
      await fillPrivateKeyWithoutPassword(tab2, {
        persistenceCheckboxChecked: false,
        persistenceCheckboxDisabled: true,
      })
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
      await expect(tab2.getByTestId('account-balance-summary')).toContainText('ROSE')

      // Second tab should not get stuck on loading after first tab closes wallet
      await page.getByRole('button', { name: /(Close wallet)|(Lock profile)/ }).click()
      await expect(page.getByText('Loading account')).toBeHidden()
      await expect(page.getByTestId('account-selector')).toBeHidden()
      await expect(tab2.getByText('Loading account')).toBeHidden()
      await expect(tab2.getByTestId('account-selector')).toBeHidden()
    }
  })

  test.describe('switch network and open second tab', () => {
    test('unpersisted', async ({ page, context }) => {
      await page.goto('/open-wallet/private-key')
      await fillPrivateKeyWithoutPassword(page, {
        persistenceCheckboxChecked: false,
        persistenceCheckboxDisabled: false,
      })
      const tab2 = await context.newPage()
      await testSyncingNetwork(page, tab2)
    })

    test('persisted', async ({ page, context }) => {
      await addPersistedStorage(page)
      await page.goto('/')
      await page.getByPlaceholder('Enter your password here').fill(password)
      await page.keyboard.press('Enter')
      const tab2 = await context.newPage()
      await testSyncingNetwork(page, tab2)
    })

    test('incognito', async ({ page, context }) => {
      await addPersistedStorage(page)
      await page.goto('/')
      await page.getByRole('button', { name: 'Continue without the profile' }).click()
      const tab2 = await context.newPage()
      await tab2.goto('/open-wallet/private-key')
      await fillPrivateKeyWithoutPassword(tab2, {
        persistenceCheckboxChecked: false,
        persistenceCheckboxDisabled: true,
      })
      await testSyncingNetwork(page, tab2)
    })

    async function testSyncingNetwork(page: Page, tab2: Page) {
      await expect(page.getByTestId('network-selector')).toHaveText('Mainnet')
      await page.getByTestId('network-selector').click()
      await page.getByRole('menuitem', { name: 'Testnet' }).click()
      await expect(page.getByTestId('network-selector')).toHaveText('Testnet')

      await tab2.goto('/')
      await expect(tab2.getByTestId('account-selector')).toBeVisible()
      await expect(page.getByTestId('network-selector')).toHaveText('Testnet')
      await expect(tab2.getByTestId('network-selector')).toHaveText('Testnet')

      await page.getByTestId('network-selector').click()
      await page.getByRole('menuitem', { name: 'Mainnet' }).click()
      await expect(page.getByTestId('network-selector')).toHaveText('Mainnet')
      await expect(tab2.getByTestId('network-selector')).toHaveText('Mainnet')
    }
  })
})
