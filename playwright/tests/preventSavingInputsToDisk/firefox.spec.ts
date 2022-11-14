import { expect, firefox } from '@playwright/test'
import { mnemonic, password, privateKey } from '../../utils/test-inputs'
import { warnSlowApi } from '../../utils/warnSlowApi'
import { mockApi } from '../../utils/mockApi'
import {
  expectMnemonicInUserData,
  expectPasswordInUserData,
  expectPrivateKeyInUserData,
  testWithUserDataDir,
} from '../../utils/testWithUserDataDir'

const test = testWithUserDataDir(firefox)

test.beforeEach(async ({ context }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
})

test('Firefox expect mnemonic, privateKey, and password to NOT leak with preventSavingInputsToUserData', async ({
  page,
  context,
  browser,
}) => {
  await test.step('fill sensitive inputs (visibility pre-toggled)', async () => {
    await page.goto('/open-wallet/mnemonic')
    await page.getByPlaceholder('Enter your keyphrase here').fill(mnemonic)
    // Do not submit form.

    const tab2 = await context.newPage()
    await tab2.goto('/open-wallet/private-key')
    await tab2.getByText('Store private keys locally, protected by a password').check()
    await tab2.getByRole('button', { name: /Show private key/ }).click()
    await tab2.getByRole('button', { name: 'Show password' }).nth(1).click()
    await tab2.getByRole('button', { name: 'Show password' }).nth(0).click()

    await tab2.getByPlaceholder('Enter your private key here').fill(privateKey)
    await tab2.getByPlaceholder('Enter your password here').fill(password)
    await tab2.getByPlaceholder('Re-enter your password').fill(password)
    // Do not submit form.
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

test('Firefox expect mnemonic, privateKey, and password to leak from unsafe inputs', async ({
  page,
  context,
  browser,
}) => {
  await test.step('expect CSS to warn about missing preventSavingInputsToUserData', async () => {
    await page.goto('/e2e')
    await page.getByRole('button', { name: 'Show unsafe inputs for Firefox' }).click()
    await expect(page.getByPlaceholder('Unsafe mnemonic')).toHaveCSS('background-color', 'rgb(255, 0, 0)')
    await expect(page.getByPlaceholder('Unsafe privateKey')).toHaveCSS('background-color', 'rgb(255, 0, 0)')
    await expect(page.getByPlaceholder('Unsafe password')).toHaveCSS('background-color', 'rgb(255, 0, 0)')
  })

  await test.step('fill sensitive inputs (visibility pre-toggled)', async () => {
    await page.getByPlaceholder('Unsafe mnemonic').fill(mnemonic)
    await page.getByPlaceholder('Unsafe privateKey').fill(privateKey)
    await page.getByPlaceholder('Unsafe password').fill(password)
    // Do not submit form.
  })

  await test.step('trigger writing to user data earlier', async () => {
    await context.close()
  })

  await test.step('password is written to user data', async () => {
    await expectPasswordInUserData(context.userDataDir).toContain('sessionstore.jsonlz4')
  })
  await test.step('privateKey is written to user data', async () => {
    await expectPrivateKeyInUserData(context.userDataDir).toContain('sessionstore.jsonlz4')
  })
  await test.step('mnemonic is written to user data', async () => {
    await expectMnemonicInUserData(context.userDataDir).toContain('sessionstore.jsonlz4')
  })
})
