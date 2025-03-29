import { test, expect } from '@playwright/test'
import { mockApi } from '../utils/mockApi'
import { warnSlowApi } from '../utils/warnSlowApi'
import { privateKey } from '../../src/utils/__fixtures__/test-inputs'

test.beforeEach(async ({ context }) => {
  await warnSlowApi(context)
  await mockApi(context, '0')
})

test.describe('Open wallet', () => {
  test('Private Key', async ({ page }) => {
    await page.goto('/open-wallet/private-key')
    await page.getByText('Create a profile').uncheck()

    await page.getByPlaceholder('Enter your private key here').fill('this is an invalid key')
    await page.getByRole('button', { name: /Import my wallet/ }).click()
    await expect(page.getByText('Invalid private key')).toBeVisible()

    await page
      .getByPlaceholder('Enter your private key here')
      .fill('aaamZybIOymrQCpCGGICczsaopANP02kwOhCyxETXljLLmRChL1QJGzJq3Pf3i+dFBN+peIK2vQ3Ew0wSQbp3g==')
    await page.getByRole('button', { name: /Import my wallet/ }).click()
    await expect(page.getByText('Invalid private key')).toBeVisible()

    await page.getByPlaceholder('Enter your private key here').fill(privateKey)
    await page.getByRole('button', { name: /Import my wallet/ }).click()
    await expect(page.getByText('Invalid private key')).toBeHidden()
  })
})
