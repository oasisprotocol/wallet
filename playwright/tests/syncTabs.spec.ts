import { test, expect } from '@playwright/test'
import { mockApi } from '../utils/mockApi'
import { warnSlowApi } from '../utils/warnSlowApi'
import { expectNoFatal } from '../utils/expectNoFatal'

const privateKey = 'X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg=='
const password = 'abcd1234&'

test.beforeEach(async ({ context, page }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
})

test.afterEach(async ({ context }, testInfo) => {
  await expectNoFatal(context, testInfo)
})

test('no infinite loading in second tab after closing wallet', async ({ page, context }) => {
  await page.goto('/open-wallet/private-key')
  await page.getByPlaceholder('Enter your private key here').fill(privateKey)
  await page.getByPlaceholder('Enter your private key here').press('Enter')
  await expect(page.getByText('Loading account')).toBeVisible()
  await expect(page.getByText('Loading account')).toBeHidden()
  await expect(page.getByTestId('account-selector')).toBeVisible()
  await expect(page).toHaveURL('http://localhost:3000/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')

  // Second tab should sync the opened wallet
  const tab2 = await context.newPage()
  await tab2.goto('/')
  await expect(tab2.getByTestId('account-selector')).toBeVisible()
  await tab2.getByRole('link', { name: 'Wallet' }).click()
  await expect(tab2).toHaveURL('http://localhost:3000/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')

  // Second tab should not get stuck on loading after first tab closes wallet
  await page.getByRole('button', { name: 'Close wallet' }).click()
  await expect(page.getByText('Loading account')).toBeHidden()
  await expect(page.getByTestId('account-selector')).toBeHidden()
  await expect(tab2.getByText('Loading account')).toBeHidden()
  await expect(tab2.getByTestId('account-selector')).toBeHidden()
})

test('lock second tab after locking wallet', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())

  await page.goto('/open-wallet/private-key')
  await page.getByPlaceholder('Enter your private key here').fill(privateKey)
  await page.getByText('Store private keys locally, protected by a password').check()
  await page.getByPlaceholder('Enter your password here').fill(password)
  await page.getByPlaceholder('Re-enter your password').fill(password)
  await page.getByPlaceholder('Enter your private key here').press('Enter')
  await expect(page.getByText('Loading account')).toBeVisible()
  await expect(page.getByText('Loading account')).toBeHidden()
  await expect(page.getByTestId('account-selector')).toBeVisible()
  await expect(page).toHaveURL('http://localhost:3000/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')

  // Second tab should sync the unlocked wallet
  const tab2 = await context.newPage()
  await tab2.goto('/')
  await expect(tab2.getByTestId('account-selector')).toBeVisible()
  await tab2.getByRole('link', { name: 'Wallet' }).click()
  await expect(tab2).toHaveURL('http://localhost:3000/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')

  // Second tab should get locked after first tab locks wallet
  await page.getByRole('button', { name: 'Lock profile' }).click()
  await expect(page.getByText('Loading account')).toBeHidden()
  await expect(page.getByRole('button', { name: 'Unlock' })).toBeVisible()
  await expect(tab2.getByText('Loading account')).toBeHidden()
  await expect(tab2.getByRole('button', { name: 'Unlock' })).toBeVisible()
})

test('lock second tab after closing incognito wallet', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())

  await page.goto('/open-wallet/private-key')
  await page.getByPlaceholder('Enter your private key here').fill(privateKey)
  await page.getByText('Store private keys locally, protected by a password').check()
  await page.getByPlaceholder('Enter your password here').fill(password)
  await page.getByPlaceholder('Re-enter your password').fill(password)
  await page.getByPlaceholder('Enter your private key here').press('Enter')
  await page.getByRole('button', { name: 'Lock profile' }).click()
  await page.getByRole('button', { name: 'Continue without the profile' }).click()
  await expect(page.getByTestId('account-selector')).toBeHidden()

  // Second tab should sync the incognito wallet
  const tab2 = await context.newPage()
  await tab2.goto('/')
  await expect(tab2.getByRole('button', { name: 'Unlock' })).toBeHidden()
  await tab2.goto('/open-wallet/private-key')
  await tab2.getByPlaceholder('Enter your private key here').fill(privateKey)
  await tab2.getByPlaceholder('Enter your private key here').press('Enter')
  await expect(tab2.getByTestId('account-selector')).toBeVisible()
  await expect(page.getByTestId('account-selector')).toBeVisible()

  // Second tab should get locked after first tab closes wallet
  await page.getByRole('button', { name: 'Close wallet' }).click()
  await expect(page.getByText('Loading account')).toBeHidden()
  await expect(page.getByRole('button', { name: 'Unlock' })).toBeVisible()
  await expect(tab2.getByText('Loading account')).toBeHidden()
  await expect(tab2.getByRole('button', { name: 'Unlock' })).toBeVisible()
})
