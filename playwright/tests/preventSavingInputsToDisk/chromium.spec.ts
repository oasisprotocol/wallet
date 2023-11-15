import { expect, chromium } from '@playwright/test'
import { mnemonic, password, privateKey } from '../../../src/utils/__fixtures__/test-inputs'
import { warnSlowApi } from '../../utils/warnSlowApi'
import { mockApi } from '../../utils/mockApi'
import {
  expectMnemonicInUserData,
  expectPasswordInUserData,
  expectPrivateKeyInUserData,
  testWithUserDataDir,
} from '../../utils/testWithUserDataDir'

const test = testWithUserDataDir(chromium)

test.beforeEach(async ({ context }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
})

test('Chromium expect mnemonic, privateKey, and password to NOT leak with preventSavingInputsToUserData', async ({
  page,
  context,
  browser,
}) => {
  await test.step('fill sensitive inputs and toggle visibility', async () => {
    await page.goto('/open-wallet/mnemonic')
    await page.getByPlaceholder('Enter your keyphrase here').fill(mnemonic)
    await page.getByRole('button', { name: /Import my wallet/ }).click()
    await expect(page.getByText('One account selected')).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: /Open/ }).click()
    await expect(page.getByText('Loading account')).toBeHidden()

    await page.goto('/open-wallet/private-key')
    await page.getByText('Store private keys locally, protected by a password').check()
    await page.getByRole('button', { name: /Show private key/ }).click()
    await page.getByRole('button', { name: 'Show password' }).nth(1).click()
    await page.getByRole('button', { name: 'Show password' }).nth(0).click()

    await page.getByPlaceholder('Enter your private key here').fill(privateKey)
    await page.getByPlaceholder('Enter your password here').fill(password)
    await page.getByPlaceholder('Re-enter your password').fill(password)
    await page.getByRole('button', { name: /Import my wallet/ }).click()
    await expect(page.getByText('Loading account')).toBeHidden()
  })

  await test.step('trigger writing to user data earlier', async () => {
    await context.close()
  })

  await test.step('password is NOT written to user data', async () => {
    await expectPasswordInUserData(context.userDataDir).toContain('exit code 1')
  })
  await test.step('privateKey is NOT written to user data', async () => {
    await expectPrivateKeyInUserData(context.userDataDir).toContain('exit code 1')
  })
  await test.step('mnemonic is NOT written to user data', async () => {
    await expectMnemonicInUserData(context.userDataDir).toContain('exit code 1')
  })
})

test('Chromium expect mnemonic, privateKey, and password to leak from unsafe inputs', async ({
  page,
  context,
  browser,
}) => {
  await test.step('expect CSS to warn about missing preventSavingInputsToUserData', async () => {
    await page.goto('/e2e')
    await page.getByRole('button', { name: 'Show unsafe inputs for Chrome' }).click()
    await expect(page.getByPlaceholder('Unsafe mnemonic')).toHaveCSS('background-color', 'rgb(255, 0, 0)')
    await expect(page.getByPlaceholder('Unsafe privateKey')).toHaveCSS('background-color', 'rgb(255, 0, 0)')
    await expect(page.getByPlaceholder('Unsafe password')).toHaveCSS('background-color', 'rgb(255, 0, 0)')
  })

  await test.step('fill sensitive inputs and toggle visibility', async () => {
    await page.getByRole('button', { name: /Show private key/ }).click()
    await page.getByRole('button', { name: /Show password/ }).click()
    await page.getByPlaceholder('Unsafe mnemonic').fill(mnemonic)
    await page.getByPlaceholder('Unsafe privateKey').fill(privateKey)
    await page.getByPlaceholder('Unsafe password').fill(password)
    await page.getByRole('button', { name: /Submit/ }).click()
  })

  await test.step('trigger writing to user data earlier', async () => {
    await context.close()
  })

  await test.step('password is written to user data', async () => {
    await expectPasswordInUserData(context.userDataDir).toContain('Sessions/Session_')
    await expectPasswordInUserData(context.userDataDir).toContain('Sessions/Tabs_')
  })
  await test.step('privateKey is written to user data', async () => {
    await expectPrivateKeyInUserData(context.userDataDir).toContain('Sessions/Session_')
    await expectPrivateKeyInUserData(context.userDataDir).toContain('Sessions/Tabs_')
  })
  await test.step('mnemonic is written to user data', async () => {
    await expectMnemonicInUserData(context.userDataDir).toContain('Sessions/Session_')
    await expectMnemonicInUserData(context.userDataDir).toContain('Sessions/Tabs_')
  })
})
