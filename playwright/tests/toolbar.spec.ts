import { test, expect, Page } from '@playwright/test'
import {
  mnemonic,
  mnemonicAddress0,
  password,
  privateKey,
  privateKeyAddress,
} from '../../src/utils/__fixtures__/test-inputs'
import { fillPrivateKeyAndPassword } from '../utils/fillPrivateKey'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'

test.beforeEach(async ({ page }) => {
  await warnSlowApi(page)
  await mockApi(page, 500000000000)
})

const tempPassword = '123'

test.describe('Profile tab', () => {
  test('should remove a profile', async ({ page }) => {
    await page.goto('/open-wallet/private-key')
    await fillPrivateKeyAndPassword(page)
    await page.getByTestId('account-selector').click()
    await page.getByTestId('toolbar-profile-tab').click()
    await page.getByRole('button', { name: 'Delete profile' }).click()
    await page.getByLabel(/Are you sure you want/).fill('delete')
    await page.getByRole('button', { name: 'Yes, delete' }).click()
    await expect(page).not.toHaveURL(new RegExp(`/account/${privateKeyAddress}`))
  })

  test('should update password', async ({ page }) => {
    await page.goto('/open-wallet/private-key')
    await fillPrivateKeyAndPassword(page)
    await page.getByTestId('account-selector').click()
    await page.getByTestId('toolbar-profile-tab').click()
    // use wrong password
    await page.getByPlaceholder('Current password').fill('wrongPassword')
    await page.getByPlaceholder('New password', { exact: true }).fill(tempPassword)
    await page.getByPlaceholder('Re-enter new password').fill(tempPassword)
    await page.keyboard.press('Enter')
    await expect(page.getByText('Wrong password')).toBeVisible()
    // set temp password
    await page.getByPlaceholder('Current password').fill(password)
    await page.keyboard.press('Enter')
    await expect(page.getByText('Password updated.')).toBeVisible()

    await page.getByTestId('close-settings-modal').click()
    await page.getByRole('button', { name: /Lock profile/ }).click()
    await page.getByPlaceholder('Enter your password here').fill(tempPassword)
    await page.getByRole('button', { name: /Unlock/ }).click()
    await expect(page.getByText('Loading', { exact: true })).toBeVisible()
    await expect(page.getByText('Loading', { exact: true })).toBeHidden()

    // set back default password
    await page.getByTestId('account-selector').click()
    await page.getByTestId('toolbar-profile-tab').click()
    await page.getByPlaceholder('Current password').fill(tempPassword)
    await page.getByPlaceholder('New password', { exact: true }).fill(password)
    await page.getByPlaceholder('Re-enter new password').fill(password)
    await page.keyboard.press('Enter')
    await expect(page.getByText('Password updated.')).toBeVisible()

    // validate default password
    await page.getByTestId('close-settings-modal').click()
    await page.getByRole('button', { name: /Lock profile/ }).click()
    await page.getByPlaceholder('Enter your password here').fill(password)
    await page.getByRole('button', { name: /Unlock/ }).click()
    await expect(page.getByText('Loading', { exact: true })).toBeVisible()
    await expect(page.getByText('Loading', { exact: true })).toBeHidden()
  })
})

test.describe('My Accounts tab', () => {
  test('should set custom name', async ({ page }) => {
    await page.goto('/open-wallet/private-key')
    await fillPrivateKeyAndPassword(page)
    await page.getByTestId('account-selector').click()
    await page.getByText('Manage').click()
    await page.getByPlaceholder('Name (Optional)').fill('My Custom Name')
    await page.keyboard.press('Enter')
    await page.getByTestId('close-settings-modal').first().click()
    await expect(page.getByTestId('close-settings-modal')).not.toBeVisible()
    await expect(page.getByText('My Custom Name')).toBeVisible()
    await expect(page.getByText('oasis1 qz0k 5q8v jqvu 4s4n wxyj 406y lnfl kc4v rcjg huwk')).not.toBeVisible()
  })

  test('should get a private key', async ({ page }) => {
    await page.goto('/open-wallet/private-key')
    await fillPrivateKeyAndPassword(page)
    await page.getByTestId('account-selector').click()
    await page.getByText('Manage').click()
    await page.getByText('Export Private Key').click()
    await page.getByText('I understand, reveal my private key').click()
    await expect(page.getByText(privateKey)).toBeVisible()
  })

  test('should not be able to remove an account', async ({ page }) => {
    await page.goto('/open-wallet/private-key')
    await fillPrivateKeyAndPassword(page)
    await page.getByTestId('account-selector').click()
    await page.getByText('Manage').click()
    await expect(page.getByText('Delete Account')).toBeDisabled()
  })

  async function openAccountSelectorWithMultipleItems(page: Page) {
    await page.goto('/open-wallet/mnemonic')
    await page.getByPlaceholder('Enter your keyphrase here').fill(mnemonic)
    await page.getByRole('button', { name: /Import my wallet/ }).click()
    const uncheckedAccounts = page.getByRole('checkbox', { name: /oasis1/, checked: false })
    await expect(uncheckedAccounts).toHaveCount(3)
    for (const account of await uncheckedAccounts.elementHandles()) await account.click()
    await page.getByRole('button', { name: /Open/ }).click()
    await page.getByTestId('account-selector').click()
    await expect(page.getByTestId('account-choice')).toHaveCount(4)
  }

  test('should remove currently selected account and switch to the first one in account list', async ({
    page,
  }) => {
    await openAccountSelectorWithMultipleItems(page)
    await page.getByText('Manage').nth(0).click()
    await page.getByText('Delete Account').click()
    await page.getByTestId('account-delete-confirmation-input').fill('foo')
    await page.getByRole('button', { name: 'Yes, delete' }).click()
    expect(page.getByText("Type 'delete'")).toBeVisible()
    await page.getByTestId('account-delete-confirmation-input').fill('delete')
    await page.getByRole('button', { name: 'Yes, delete' }).click()
    await expect(page).not.toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
    await expect(page.getByTestId('account-choice')).toHaveCount(3)
  })

  test('should remove not currently selected account', async ({ page }) => {
    await openAccountSelectorWithMultipleItems(page)
    await page.getByText('Manage').nth(1).click()
    await page.getByText('Delete Account').click()
    await page.getByTestId('account-delete-confirmation-input').fill('delete')
    await page.getByRole('button', { name: 'Yes, delete' }).click()
    await expect(page).toHaveURL(new RegExp(`/account/${mnemonicAddress0}`))
    await expect(page.getByTestId('account-choice')).toHaveCount(3)
  })
})
