import { expect, test, Page } from '@playwright/test'
import { password, privateKey, privateKeyAddress } from '../../src/utils/__fixtures__/test-inputs'

export async function fillPrivateKeyWithoutPassword(
  page: Page,
  params: {
    privateKey?: string
    privateKeyAddress?: string
    persistenceCheckboxDisabled: false | 'disabled-checked' | 'disabled-unchecked'
    ticker?: string
  },
) {
  await test.step('fillPrivateKeyWithoutPassword', async () => {
    await expect(page).toHaveURL(new RegExp('/open-wallet/private-key'))

    const persistence = await page.getByText('Create a profile')
    if (params.persistenceCheckboxDisabled === 'disabled-checked') {
      await expect(persistence).toBeDisabled()
      await expect(persistence).toBeChecked()
    } else if (params.persistenceCheckboxDisabled === 'disabled-unchecked') {
      await expect(persistence).toBeDisabled()
      await expect(persistence).not.toBeChecked()
    } else {
      await expect(persistence).toBeEnabled()
    }

    await page.getByPlaceholder('Enter your private key here').fill(params.privateKey ?? privateKey)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`/account/${params.privateKeyAddress ?? privateKeyAddress}`))
    await expect(page.getByText('Loading account')).toBeVisible()
    await expect(page.getByText('Loading account')).toBeHidden()
    await expect(page.getByTestId('account-balance-summary')).toContainText(params.ticker ?? 'ROSE')
  })
}

export async function fillPrivateKeyAndPassword(
  page: Page,
  params: { privateKey?: string; privateKeyAddress?: string; ticker?: string } = {},
) {
  await test.step('fillPrivateKeyAndPassword', async () => {
    await expect(page).toHaveURL(new RegExp('/open-wallet/private-key'))

    const persistence = await page.getByText('Create a profile')
    await expect(persistence).toBeEnabled()
    await persistence.check()

    await page.getByPlaceholder('Enter your private key here').fill(params.privateKey ?? privateKey)
    await page.getByPlaceholder('Enter your password', { exact: true }).fill(password)
    await page.getByPlaceholder('Confirm your password').fill(password)
    await page.getByText('I understand this password and profile do not substitute my mnemonic.').check()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`/account/${params.privateKeyAddress ?? privateKeyAddress}`))
    await expect(page.getByText('Loading account')).toBeVisible()
    await expect(page.getByText('Loading account')).toBeHidden()
    await expect(page.getByTestId('account-balance-summary')).toContainText(params.ticker ?? 'ROSE')
  })
}
