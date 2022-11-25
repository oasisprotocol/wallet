import { test, expect } from '@playwright/test'
import { mockApi } from '../utils/mockApi'
import { warnSlowApi } from '../utils/warnSlowApi'
import { expectNoFatal } from '../utils/expectNoFatal'
import { addPersistedStorage, clearPersistedStorage } from '../utils/storage'
import {
  mnemonicAddress0,
  mnemonic,
  privateKeyAddress,
  privateKey,
  privateKey2Address,
  privateKey2,
  password,
  wrongPassword,
} from '../utils/test-inputs'

test.beforeEach(async ({ context, page }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
  await clearPersistedStorage(page)
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
      const uncheckedAccounts = page.getByRole('checkbox', { name: /oasis1/, checked: false })
      await expect(uncheckedAccounts).toHaveCount(3)
      for (const account of await uncheckedAccounts.elementHandles()) await account.click()

      const persistence = await page.getByText('Store private keys locally, protected by a password')
      await expect(persistence).toBeEnabled()
      await expect(persistence).not.toBeChecked()
      await persistence.check()
      await page.getByRole('button', { name: /Open/ }).click()
    })
    await test.step('Expect password must be chosen', async () => {
      await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
      await page.getByPlaceholder('Enter your password here').fill(password)
      await page.keyboard.press('Enter')
    })
    await test.step('Expect repeated password must match', async () => {
      await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
      await page.getByPlaceholder('Re-enter your password').fill(wrongPassword)
      await page.keyboard.press('Enter')
      await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
      await page.getByPlaceholder('Re-enter your password').fill(password)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))

      await page.getByTestId('account-selector').click({ timeout: 15_000 })
      await expect(page.getByTestId('account-choice')).toHaveCount(4)
      await expect(page).toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
    })
    await test.step('Expect correct password is required to unlock', async () => {
      await page.goto('/')
      await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
      await page.getByPlaceholder('Enter your password here').fill(wrongPassword)
      await page.keyboard.press('Enter')
      await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
      await page.getByPlaceholder('Enter your password here').fill(password)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))

      await page.getByTestId('account-selector').click({ timeout: 15_000 })
      await expect(page.getByTestId('account-choice')).toHaveCount(4)
    })
  })

  test('Should persist private key accounts', async ({ page }) => {
    await test.step('Import from private key', async () => {
      await page.goto('/open-wallet/private-key')

      const persistence = await page.getByText('Store private keys locally, protected by a password')
      await expect(persistence).toBeEnabled()
      await expect(persistence).not.toBeChecked()
      await persistence.check()

      await page.getByPlaceholder('Enter your private key here').fill(privateKey)
      await page.keyboard.press('Enter')
    })
    await test.step('Expect password must be chosen', async () => {
      await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await page.getByPlaceholder('Enter your password here').fill(password)
      await page.keyboard.press('Enter')
    })
    await test.step('Expect repeated password must match', async () => {
      await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await page.getByPlaceholder('Re-enter your password').fill(wrongPassword)
      await page.keyboard.press('Enter')
      await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await page.getByPlaceholder('Re-enter your password').fill(password)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await expect(page.getByText('Loading account')).toBeVisible()
      await expect(page.getByText('Loading account')).toBeHidden()
    })
    await test.step('Expect correct password is required to unlock', async () => {
      await page.goto('/')
      await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await page.getByPlaceholder('Enter your password here').fill(wrongPassword)
      await page.keyboard.press('Enter')
      await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
      await page.getByPlaceholder('Enter your password here').fill(password)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))

      await page.getByTestId('account-selector').click({ timeout: 15_000 })
      await expect(page.getByTestId('account-choice')).toHaveCount(1)
      await page.getByRole('button', { name: /Close/ }).click()
    })
    await test.step('Add another account after reloading and unlocking and it should persist', async () => {
      await page.getByRole('link', { name: /Home/ }).click()
      await page.getByRole('button', { name: /Open wallet/ }).click()
      await page.getByRole('button', { name: /Private key/ }).click()
      const persistence = await page.getByText('Store private keys locally, protected by a password')
      await expect(persistence).toBeDisabled()
      await expect(persistence).toBeChecked()
      await page.getByPlaceholder('Enter your private key here').fill(privateKey2)
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/account/${privateKey2Address}`))
      await page.goto('/')
      await page.getByPlaceholder('Enter your password here').fill(password)
      await page.keyboard.press('Enter')
      await page.getByTestId('account-selector').click({ timeout: 15_000 })
      await expect(page.getByTestId('account-choice')).toHaveCount(2)
    })
  })

  test('Should reload balance after unlocking, in case balance has changed while locked', async ({
    context,
    page,
  }) => {
    await addPersistedStorage(page)
    await page.goto('/')
    await mockApi(context, 123)
    await page.getByPlaceholder('Enter your password here').fill(password)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
    await expect(page.getByTestId('account-balance-summary')).toContainText('123.0')
    await page.getByRole('button', { name: /Lock profile/ }).click()
    await mockApi(context, 456)
    await page.getByPlaceholder('Enter your password here').fill(password)
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('account-balance-summary')).toContainText('456.0')
  })

  test('Should NOT persist if user chooses password but unchecks persistence before opening accounts', async ({
    page,
  }) => {
    await page.goto('/open-wallet/mnemonic')

    await page.getByPlaceholder('Enter your keyphrase here').fill(mnemonic)
    await page.getByRole('button', { name: /Import my wallet/ }).click()

    await page.getByText('Store private keys locally, protected by a password').check()
    await page.getByPlaceholder('Enter your password here').fill(password)
    await page.keyboard.press('Enter')
    await page.getByPlaceholder('Re-enter your password').fill(password)
    await page.getByText('Store private keys locally, protected by a password').uncheck()

    await page.getByRole('button', { name: /Open/ }).click()
    await expect(page).toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
    await expect(page.getByText('Loading account')).toBeVisible()
    await expect(page.getByText('Loading account')).toBeHidden()

    await page.goto('/')
    await expect(page.getByPlaceholder('Enter your password here')).toBeHidden()
    await expect(page.getByTestId('account-selector')).toBeHidden()
  })

  test('Should NOT persist changes after user skips unlocking', async ({ page }) => {
    await addPersistedStorage(page)
    await page.goto('/')
    await page.getByRole('button', { name: /Continue without the profile/ }).click()
    await page.getByRole('button', { name: /Open wallet/ }).click()
    await page.getByRole('button', { name: /Private key/ }).click()

    const persistence = await page.getByText('Store private keys locally, protected by a password')
    await expect(persistence).toBeDisabled()
    await expect(persistence).not.toBeChecked()

    await page.getByPlaceholder('Enter your private key here').fill(privateKey2)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`/account/${privateKey2Address}`))
    await page.goto('/')
    await page.getByPlaceholder('Enter your password here').fill(password)
    await page.keyboard.press('Enter')
    await page.getByTestId('account-selector').click({ timeout: 15_000 })
    await expect(page.getByTestId('account-choice')).toHaveCount(1)
  })

  test('Should NOT crash after quickly locking a wallet', async ({ page }) => {
    await addPersistedStorage(page)
    await page.goto('/')
    await page.getByRole('button', { name: /Continue without the profile/ }).click()
    await page.getByRole('button', { name: /Close wallet/ }).click()
    await page.waitForTimeout(1000)
    await expect(page.getByTestId('fatalerror-stacktrace')).toBeHidden()
  })

  test('Opening a wallet after erasing a profile should NOT crash', async ({ page }) => {
    await addPersistedStorage(page)
    await page.goto('/')

    page.once('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: /Erase profile/ }).click()

    await page.getByRole('button', { name: /Open wallet/ }).click()
    await page.getByRole('button', { name: /Private key/ }).click()
    await page.getByPlaceholder('Enter your private key here').fill(privateKey)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
  })
})
