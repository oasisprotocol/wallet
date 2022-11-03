import { expect, Page } from '@playwright/test'
import { password, privateKey, privateKeyAddress } from './test-inputs'

export async function fillPrivateKeyWithoutPassword(
  page: Page,
  params: {
    privateKey?: string
    privateKeyAddress?: string
    persistenceCheckboxDisabled: boolean
    persistenceCheckboxChecked: boolean
  },
) {
  await expect(page).toHaveURL(new RegExp('/open-wallet/private-key'))

  const persistence = await page.getByText('Store private keys locally, protected by a password')
  if (params.persistenceCheckboxDisabled) {
    await expect(persistence).toBeDisabled()
  } else {
    await expect(persistence).toBeEnabled()
  }
  if (params.persistenceCheckboxChecked) {
    await expect(persistence).toBeChecked()
  } else {
    await expect(persistence).not.toBeChecked()
  }

  await page.getByPlaceholder('Enter your private key here').fill(params.privateKey ?? privateKey)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(new RegExp(`/account/${params.privateKeyAddress ?? privateKeyAddress}`))
  await expect(page.getByText('Loading account')).toBeVisible()
  await expect(page.getByText('Loading account')).toBeHidden()
}

export async function fillPrivateKeyAndPassword(
  page: Page,
  params: { privateKey?: string; privateKeyAddress?: string } = {},
) {
  await expect(page).toHaveURL(new RegExp('/open-wallet/private-key'))

  const persistence = await page.getByText('Store private keys locally, protected by a password')
  await expect(persistence).toBeEnabled()
  await expect(persistence).not.toBeChecked()
  await persistence.check()

  await page.getByPlaceholder('Enter your private key here').fill(params.privateKey ?? privateKey)
  await page.getByPlaceholder('Enter your password here').fill(password)
  await page.getByPlaceholder('Re-enter your password').fill(password)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(new RegExp(`/account/${params.privateKeyAddress ?? privateKeyAddress}`))
  await expect(page.getByText('Loading account')).toBeVisible()
  await expect(page.getByText('Loading account')).toBeHidden()
}
