import { test, expect } from '@playwright/test'
import { password } from '../utils/test-inputs'
import { fillPrivateKeyAndPassword } from '../utils/fillPrivateKey'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'

test.beforeEach(async ({ page }) => {
  await warnSlowApi(page)
  await mockApi(page, 500000000000)
})

const tempPassword = '123'

test.describe('Profile tab', () => {
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
