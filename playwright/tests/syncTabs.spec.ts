import { test, expect, Page, Route } from '@playwright/test'
import { mockApi } from '../utils/mockApi'
import { warnSlowApi } from '../utils/warnSlowApi'
import { expectNoFatal } from '../utils/expectNoFatal'
import {
  password,
  privateKeyAddress,
  privateKeyAddressPretty,
  privateKey2,
  privateKey2AddressPretty,
  mnemonic,
} from '../../src/utils/__fixtures__/test-inputs'
import { addPersistedStorageV1, clearPersistedStorage } from '../utils/storage'
import { fillPrivateKeyWithoutPassword, fillPrivateKeyAndPassword } from '../utils/fillPrivateKey'
import type { AccountsRow } from '../../src/vendors/oasisscan/index'

test.beforeEach(async ({ context, page }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
  await clearPersistedStorage(page, '/app.webmanifest')
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
      await expect(page.getByRole('button', { name: /^Unlock$/ })).toBeVisible()
      await expect(tab2.getByRole('button', { name: /^Unlock$/ })).toBeVisible()
    })

    test('incognito', async ({ page, context }) => {
      await addPersistedStorageV1(page, '/app.webmanifest')
      await page.goto('/')
      await page.getByRole('button', { name: 'Continue without the profile' }).click()
      await expect(page.getByTestId('account-selector')).toBeHidden()

      const tab2 = await context.newPage()
      await tab2.goto('/')
      await expect(tab2.getByRole('button', { name: /^(Open wallet)|(Unlock)$/ })).toBeVisible()
      await expect(tab2.getByRole('button', { name: /^Unlock$/ })).toBeHidden()
      await tab2.goto('/open-wallet/private-key')
      await fillPrivateKeyWithoutPassword(tab2, {
        persistenceCheckboxChecked: false,
        persistenceCheckboxDisabled: true,
      })
      await expect(tab2.getByTestId('account-selector')).toBeVisible()
      await expect(page.getByTestId('account-selector')).toBeVisible()

      await testLockingIsSynced(page, tab2)
      await expect(page.getByRole('button', { name: /^Unlock$/ })).toBeVisible()
      await expect(tab2.getByRole('button', { name: /^Unlock$/ })).toBeVisible()
    })

    async function testLockingIsSynced(page: Page, tab2: Page) {
      // Second tab should sync the opened wallet
      await tab2.goto('/')
      await expect(tab2.getByTestId('account-selector')).toBeVisible()
      await tab2.getByRole('link', { name: 'ROSE Wallet', exact: true }).click()
      await expect(tab2).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await expect(tab2.getByTestId('account-balance-summary')).toContainText('ROSE')

      // Second tab should not get stuck on loading after first tab closes wallet
      await page.getByRole('button', { name: /^(Close wallet)|(Unlock profile)|(Lock profile)$/ }).click()
      await expect(page.getByRole('button', { name: /^(Open wallet)|(Unlock)$/ })).toBeVisible()
      await expect(page.getByText('Loading account')).toBeHidden()
      await expect(page.getByTestId('account-selector')).toBeHidden()
      await expect(tab2.getByRole('button', { name: /^(Open wallet)|(Unlock)$/ })).toBeVisible()
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
      await addPersistedStorageV1(page, '/app.webmanifest')
      await page.goto('/')
      await page.getByPlaceholder('Enter your password here').fill(password)
      await page.keyboard.press('Enter')
      const tab2 = await context.newPage()
      await testSyncingNetwork(page, tab2)
    })

    test('incognito', async ({ page, context }) => {
      await addPersistedStorageV1(page, '/app.webmanifest')
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

  test.describe('adding and removing contacts in tabs', () => {
    test('persisted', async ({ page, context }) => {
      await addPersistedStorageV1(page, '/app.webmanifest')
      await page.goto('/')
      await page.getByPlaceholder('Enter your password here').fill(password)
      await page.keyboard.press('Enter')
      const tab2 = await context.newPage()
      await testSyncingContacts(page, tab2)
    })

    async function testSyncingContacts(page: Page, tab2: Page) {
      await page.getByTestId('account-selector').click()
      await page.getByTestId('toolbar-contacts-tab').click()
      await page.getByText('You have no contacts yet.')

      await page.getByRole('button', { name: 'Add Contact' }).click()
      await page.getByPlaceholder('Name').fill('stakefish')
      await page
        .getByPlaceholder('Address', { exact: true })
        .fill('oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe')
      await page.getByRole('button', { name: 'Save' }).click()
      await expect(page.getByTestId('account-choice')).toHaveCount(1)

      await tab2.goto('/')
      await tab2.getByTestId('account-selector').click()
      await tab2.getByTestId('toolbar-contacts-tab').click()
      await expect(tab2.getByTestId('account-choice')).toHaveCount(1)
      await tab2.getByRole('button', { name: 'Add Contact' }).click()
      await tab2.getByPlaceholder('Name').fill('Foo')
      await tab2
        .getByPlaceholder('Address', { exact: true })
        .fill('oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4')
      await tab2.getByRole('button', { name: 'Save' }).click()
      await expect(tab2.getByTestId('account-choice')).toHaveCount(2)
      await expect(page.getByTestId('account-choice')).toHaveCount(2)

      await page.getByRole('button', { name: 'Manage' }).first().click()
      await page.getByRole('button', { name: 'Delete contact' }).click()
      await page.getByRole('button', { name: 'Yes, delete' }).click()

      await page.getByRole('button', { name: 'Manage' }).click()
      await page.getByPlaceholder('Name').fill('Bar')
      await page.getByRole('button', { name: 'Cancel' }).click()
      await expect(page.getByTestId('account-name')).toHaveText('Foo')
      await expect(tab2.getByTestId('account-name')).toHaveText('Foo')

      await page.getByRole('button', { name: 'Manage' }).click()
      await page.getByRole('button', { name: 'Delete contact' }).click()
      await page.getByRole('button', { name: 'Yes, delete' }).click()
      await expect(page.getByText('You have no contacts yet.')).toBeVisible()
      await expect(tab2.getByText('You have no contacts yet.')).toBeVisible()
    }
  })

  test.describe('switching account should not sync', () => {
    test('unpersisted', async ({ page, context }) => {
      await page.goto('/open-wallet/private-key')
      await fillPrivateKeyWithoutPassword(page, {
        persistenceCheckboxChecked: false,
        persistenceCheckboxDisabled: false,
      })
      const tab2 = await context.newPage()
      await testSelectedAccountNotSync(page, tab2)
    })

    test('persisted', async ({ page, context }) => {
      await addPersistedStorageV1(page, '/app.webmanifest')
      await page.goto('/')
      await page.getByPlaceholder('Enter your password here').fill(password)
      await page.keyboard.press('Enter')
      const tab2 = await context.newPage()
      await testSelectedAccountNotSync(page, tab2)
    })

    test('incognito', async ({ page, context }) => {
      await addPersistedStorageV1(page, '/app.webmanifest')
      await page.goto('/')
      await page.getByRole('button', { name: 'Continue without the profile' }).click()
      const tab2 = await context.newPage()
      await tab2.goto('/open-wallet/private-key')
      await fillPrivateKeyWithoutPassword(tab2, {
        persistenceCheckboxChecked: false,
        persistenceCheckboxDisabled: true,
      })
      await testSelectedAccountNotSync(page, tab2)
    })

    async function testSelectedAccountNotSync(page: Page, tab2: Page) {
      await tab2.goto('/')
      await tab2.getByTestId('account-selector').click()
      await expect(tab2.getByRole('checkbox', { checked: true })).toContainText(privateKeyAddressPretty) // Synced on load

      await page.getByRole('link', { name: /Home/ }).click()
      await page.getByRole('button', { name: /Open wallet/ }).click()
      await page.getByRole('button', { name: /Private key/ }).click()
      await page.getByPlaceholder('Enter your private key here').fill(privateKey2)
      await page.keyboard.press('Enter')
      await page.getByTestId('account-selector').click()

      await expect(page.getByRole('checkbox', { checked: true })).toContainText(privateKey2AddressPretty)
      await expect(tab2.getByRole('checkbox', { checked: true })).toContainText(privateKeyAddressPretty) // Not synced

      await page.getByRole('checkbox', { name: privateKeyAddressPretty }).click()
      await page.getByTestId('account-selector').click()
      await page.getByRole('checkbox', { name: privateKey2AddressPretty }).click()
      await page.getByTestId('account-selector').click()

      await expect(page.getByRole('checkbox', { checked: true })).toContainText(privateKey2AddressPretty)
      await expect(tab2.getByRole('checkbox', { checked: true })).toContainText(privateKeyAddressPretty) // Not synced

      await tab2.goto('/')
      await tab2.getByTestId('account-selector').click()
      await expect(tab2.getByRole('checkbox', { checked: true })).toContainText(privateKey2AddressPretty) // Synced on load
    }
  })

  test('sync 44 accounts in 10 tabs', async ({ page, context }) => {
    test.setTimeout(240_000)
    await test.step('Import 44 accounts', async () => {
      await page.goto('/open-wallet/mnemonic')
      await page.getByTestId('network-selector').click()
      await page.getByRole('menuitem', { name: 'Testnet' }).click()

      await page.getByPlaceholder('Enter your keyphrase here').fill(mnemonic)
      await page.getByRole('button', { name: /Import my wallet/ }).click()
      await expect(page.getByText('One account selected')).toBeVisible({ timeout: 10_000 })
      await page.getByRole('checkbox', { name: /oasis1/, checked: true }).uncheck()
      for (let i = 0; i < 11; i++) {
        const uncheckedAccounts = page.getByRole('checkbox', { name: /oasis1/, checked: false })
        await expect(uncheckedAccounts).toHaveCount(4)
        for (const account of await uncheckedAccounts.elementHandles()) await account.click()
        await page.getByRole('button', { name: /Next/ }).click()
      }
      await expect(page.getByText('44 accounts selected')).toBeVisible()
      await page.getByRole('button', { name: /Open/ }).click()
    })
    await test.step('Test initial syncing of 10 tabs', async () => {
      for (let i = 0; i < 10; i++) {
        const newTab = await context.newPage()
        await newTab.goto('/')
      }
      for (const tab of context.pages()) {
        await expect(tab.getByTestId('network-selector')).toHaveText('Testnet')
      }
    })
    await test.step('Test syncing actions to 10 tabs', async () => {
      await page.getByTestId('network-selector').click()
      await page.getByRole('menuitem', { name: 'Mainnet' }).click()
      for (const tab of context.pages()) {
        await expect(tab.getByTestId('network-selector')).toHaveText('Mainnet')
      }
    })
  })

  test('TODO opening from private key and quickly locking in second tab should not crash', async ({
    page,
    context,
  }) => {
    await addPersistedStorageV1(page, '/app.webmanifest')
    await page.goto('/')
    await page.getByPlaceholder('Enter your password here').fill(password)
    await page.keyboard.press('Enter')
    await page.getByRole('link', { name: /Home/ }).click()
    await page.getByRole('button', { name: /Open wallet/ }).click()
    await page.getByRole('button', { name: /Private key/ }).click()
    const tab2 = await context.newPage()
    await tab2.goto('/')
    await expect(tab2.getByText('Loading account')).toBeVisible()
    await expect(tab2.getByText('Loading account')).toBeHidden()

    // Delay getAccountBalanceWithFallback so addWallet is called after wallet is locked.
    let apiBalance: Route
    await context.route('**/chain/account/info/*', route => (apiBalance = route))

    await page.getByPlaceholder('Enter your private key here').fill(privateKey2)
    await page.keyboard.press('Enter')
    await tab2.getByRole('button', { name: /Lock profile/ }).click()
    await apiBalance!.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          rank: 0,
          address: '',
          available: '0',
          escrow: '0',
          debonding: '0',
          total: '0',
          nonce: 1,
          allowances: [],
        } satisfies AccountsRow,
      }),
    })
    await page.waitForTimeout(100)

    // TODO: https://github.com/oasisprotocol/oasis-wallet-web/pull/975#discussion_r1019567305
    // await expect(page.getByTestId('fatalerror-stacktrace')).toBeHidden()
    await expect(page.getByTestId('fatalerror-stacktrace')).toBeVisible()
    await page.close() // Just to avoid expectNoFatal in afterEach
  })
})
