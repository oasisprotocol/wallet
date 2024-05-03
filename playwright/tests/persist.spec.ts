import { test, expect, Page } from '@playwright/test'
import { mockApi } from '../utils/mockApi'
import { warnSlowApi } from '../utils/warnSlowApi'
import { expectNoFatal } from '../utils/expectNoFatal'
import { addPersistedStorageV1, clearPersistedStorage } from '../utils/storage'
import {
  mnemonicAddress0,
  mnemonic,
  privateKeyAddress,
  privateKey,
  privateKey2Address,
  privateKey2,
  password,
  wrongPassword,
} from '../../src/utils/__fixtures__/test-inputs'
import { fillPrivateKeyWithoutPassword, fillPrivateKeyAndPassword } from '../utils/fillPrivateKey'

test.beforeEach(async ({ context, page }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
  await clearPersistedStorage(page, '/app.webmanifest')
})

test.afterEach(async ({ context }, testInfo) => {
  await expectNoFatal(context, testInfo)
})

test.describe('Persist', () => {
  test('Should persist multiple mnemonic accounts', async ({ page }) => {
    await test.step('Import from mnemonic', async () => {
      await page.goto('/open-wallet/mnemonic')
      await page.getByPlaceholder('Enter your keyphrase here').fill(mnemonic)
      await page.getByRole('button', { name: /Import my wallet/ }).click()
      await expect(page.getByText('One account selected')).toBeVisible({ timeout: 10_000 })
      const uncheckedAccounts = page.getByRole('checkbox', { name: /oasis1/, checked: false })
      await expect(uncheckedAccounts).toHaveCount(3)
      for (const account of await uncheckedAccounts.elementHandles()) await account.click()

      const persistence = await page.getByText('Create a profile')
      await expect(persistence).toBeEnabled()
      await expect(persistence).not.toBeChecked()
      await persistence.check()
      await page.getByRole('button', { name: /Open/ }).click()
    })
    await test.step('Expect password must be chosen', async () => {
      await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
      await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
      await page.keyboard.press('Enter')
    })
    await test.step('Expect repeated password must match', async () => {
      await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
      await page.getByPlaceholder('Confirm your password').fill(wrongPassword)
      await page.getByText('I understand this password and profile do not substitute my mnemonic.').check()
      await page.keyboard.press('Enter')
      await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
      await page.getByPlaceholder('Confirm your password').fill(password)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))

      await page.getByTestId('account-selector').click({ timeout: 15_000 })
      await expect(page.getByTestId('account-choice')).toHaveCount(4)
      await expect(page).toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
    })
    await test.step('Expect correct password is required to unlock', async () => {
      await page.goto('/')
      await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
      await page.getByPlaceholder('Enter your password', { exact: true }).fill(wrongPassword)
      await page.keyboard.press('Enter')
      await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
      await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))

      await page.getByTestId('account-selector').click({ timeout: 15_000 })
      await expect(page.getByTestId('account-choice')).toHaveCount(4)
    })
  })

  test('Should persist private key accounts', async ({ page }) => {
    await test.step('Import from private key', async () => {
      await page.goto('/open-wallet/private-key')

      const persistence = await page.getByText('Create a profile')
      await expect(persistence).toBeEnabled()
      await expect(persistence).not.toBeChecked()
      await persistence.check()

      await page.getByPlaceholder('Enter your private key here').fill(privateKey)
      await page.keyboard.press('Enter')
    })
    await test.step('Expect password must be chosen', async () => {
      await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
      await page.keyboard.press('Enter')
    })
    await test.step('Expect repeated password must match', async () => {
      await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await page.getByPlaceholder('Confirm your password').fill(wrongPassword)
      await page.getByText('I understand this password and profile do not substitute my mnemonic.').check()
      await page.keyboard.press('Enter')
      await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await page.getByPlaceholder('Confirm your password').fill(password)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await expect(page.getByText('Loading account')).toBeVisible()
      await expect(page.getByText('Loading account')).toBeHidden()
    })
    await test.step('Expect correct password is required to unlock', async () => {
      await page.goto('/')
      await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await page.getByPlaceholder('Enter your password', { exact: true }).fill(wrongPassword)
      await page.keyboard.press('Enter')
      await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))

      await page.getByTestId('account-selector').click({ timeout: 15_000 })
      await expect(page.getByTestId('account-choice')).toHaveCount(1)
      await page.getByRole('button', { name: /Select/ }).click()
    })
    await test.step('Add another account after reloading and unlocking and it should persist', async () => {
      await page.getByRole('link', { name: /Home/ }).click()
      await page.getByRole('button', { name: /Open wallet/ }).click()
      await page.getByRole('button', { name: /Private key/ }).click()
      await fillPrivateKeyWithoutPassword(page, {
        privateKey: privateKey2,
        privateKeyAddress: privateKey2Address,
        persistenceCheckboxChecked: true,
        persistenceCheckboxDisabled: true,
      })
      await page.goto('/')
      await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
      await page.keyboard.press('Enter')
      await page.getByTestId('account-selector').click({ timeout: 15_000 })
      await expect(page.getByTestId('account-choice')).toHaveCount(2)
    })
  })

  test('Should reload balance after unlocking, in case balance has changed while locked', async ({
    context,
    page,
  }) => {
    await addPersistedStorageV1(page, '/app.webmanifest')
    await page.goto('/')
    await mockApi(context, 123)
    await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
    await expect(page.getByTestId('account-balance-summary')).toContainText('123.0')
    await expect(page.getByTestId('account-balance-summary')).toContainText('ROSE')
    await page.getByRole('button', { name: /Lock profile/ }).click()
    await mockApi(context, 456)
    await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('account-balance-summary')).toContainText('456.0')
    await expect(page.getByTestId('account-balance-summary')).toContainText('ROSE')
  })

  test('Should NOT persist if user chooses password but unchecks persistence before opening accounts', async ({
    page,
  }) => {
    await page.goto('/open-wallet/mnemonic')

    await page.getByPlaceholder('Enter your keyphrase here').fill(mnemonic)
    await page.getByRole('button', { name: /Import my wallet/ }).click()
    await expect(page.getByText('One account selected')).toBeVisible({ timeout: 10_000 })

    await page.getByText('Create a profile').check()
    await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
    await page.getByText('I understand this password and profile do not substitute my mnemonic.').check()
    await page.keyboard.press('Enter')
    await page.getByPlaceholder('Confirm your password').fill(password)
    await page.getByText('Create a profile').uncheck()

    await page.getByRole('button', { name: /Open/ }).click()
    await expect(page).toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
    await expect(page.getByText('Loading account')).toBeVisible()
    await expect(page.getByText('Loading account')).toBeHidden()

    await page.goto('/')
    await expect(page.getByRole('button', { name: /^(Open wallet)|(Unlock)$/ })).toBeVisible()
    await expect(page.getByPlaceholder('Enter your password', { exact: true })).toBeHidden()
    await expect(page.getByTestId('account-selector')).toBeHidden()
  })

  test('Should NOT persist changes after user skips unlocking', async ({ page }) => {
    await addPersistedStorageV1(page, '/app.webmanifest')
    await page.goto('/')
    await page.getByRole('button', { name: /Continue without the profile/ }).click()
    await page.getByRole('button', { name: /Open wallet/ }).click()
    await page.getByRole('button', { name: /Private key/ }).click()

    await fillPrivateKeyWithoutPassword(page, {
      privateKey: privateKey2,
      privateKeyAddress: privateKey2Address,
      persistenceCheckboxChecked: false,
      persistenceCheckboxDisabled: true,
    })
    await page.goto('/')
    await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
    await page.keyboard.press('Enter')
    await page.getByTestId('account-selector').click({ timeout: 15_000 })
    await expect(page.getByTestId('account-choice')).toHaveCount(1)
  })

  test('Should NOT crash after quickly locking a wallet', async ({ page }) => {
    await addPersistedStorageV1(page, '/app.webmanifest')
    await page.goto('/')
    await page.getByRole('button', { name: /Continue without the profile/ }).click()
    await page.getByRole('button', { name: /Unlock profile/ }).click()
    await page.waitForTimeout(1000)
    await expect(page.getByTestId('fatalerror-stacktrace')).toBeHidden()
  })

  test.describe('Opening a wallet after deleting a profile should NOT crash', () => {
    test('deleting newly created', async ({ page }) => {
      await page.goto('/open-wallet/private-key')
      await fillPrivateKeyAndPassword(page)
      await page.getByRole('button', { name: /Lock profile/ }).click()
      await testDeletingAndCreatingNew(page)
    })

    test('deleting stored', async ({ page }) => {
      await addPersistedStorageV1(page, '/app.webmanifest')
      await page.goto('/')
      await testDeletingAndCreatingNew(page)
    })

    async function testDeletingAndCreatingNew(page: Page) {
      await page.getByRole('button', { name: 'Forgot password?' }).click()
      await page.getByLabel(/To confirm and proceed/).fill('delete')
      await page.getByRole('button', { name: 'Yes, delete' }).click()

      await page.getByRole('button', { name: /Open wallet/ }).click()
      await page.getByRole('button', { name: /Private key/ }).click()
      await fillPrivateKeyWithoutPassword(page, {
        persistenceCheckboxChecked: false,
        persistenceCheckboxDisabled: false,
      })
    }
  })

  test('Password should not be cached in input field', async ({ page }) => {
    await addPersistedStorageV1(page, '/app.webmanifest')
    await page.goto('/')
    await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: /Lock profile/ }).click()
    await expect(page.getByPlaceholder('Enter your password', { exact: true })).toHaveValue('')
  })
})
