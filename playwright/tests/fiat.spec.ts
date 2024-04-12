import { test, expect, Page } from '@playwright/test'
import { privateKey, privateKeyAddress } from '../../src/utils/__fixtures__/test-inputs'
import { fillPrivateKeyWithoutPassword } from '../utils/fillPrivateKey'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'
import { expectNoErrorsInConsole } from '../utils/expectNoErrorsInConsole'

async function setup(page: Page) {
  await warnSlowApi(page)
  await mockApi(page, 500000000000)

  await page.goto('/open-wallet/private-key')
  await fillPrivateKeyWithoutPassword(page, {
    privateKey: privateKey,
    privateKeyAddress: privateKeyAddress,
    persistenceCheckboxChecked: false,
    persistenceCheckboxDisabled: false,
  })
  await expect(page.getByTestId('account-selector')).toBeVisible()
  await page.getByRole('link', { name: 'Buy' }).click()
  await expect(page.getByRole('heading', { name: 'Buy ROSE' })).toBeVisible()
}

test.describe('Fiat on-ramp', () => {
  test('Content-Security-Policy should allow embedded Transak widget', async ({ page }) => {
    expect((await page.request.head('/')).headers()).toHaveProperty('content-security-policy')
    await expectNoErrorsInConsole(page, {
      ignoreError: msg => {
        // Odd errors inside Transak
        if (msg.text().includes('responded with a status of 403')) return true
        if (msg.text().includes('`sessionKey` is a required property')) return true
        if (msg.text().includes('[Report Only]')) return true
        if (msg.text().includes('script-src https://*.transak.com https://*.google.com')) return true
      },
    })
    await setup(page)
    await page
      .getByText(
        'I understand that I’m using a third-party solution and Oasis* does not carry any responsibility over the usage of this solution.',
      )
      .click()
    await expect(page.frameLocator('iframe')!.getByAltText('Powered by Transak')).toBeVisible()
    await page.frameLocator('iframe')!.getByText('Buy now').click()
    await expect(page.frameLocator('iframe')!.getByText(/email/i).first()).toBeVisible()
  })

  test('Content-Security-Policy should also allow Transak staging iframe', async ({ page }) => {
    expect((await page.request.head('/')).headers()).toHaveProperty('content-security-policy')
    await expectNoErrorsInConsole(page)
    await setup(page)
    await page.route('https://*.transak.com/?*', route =>
      route.fulfill({ status: 301, headers: { Location: 'https://global-stg.transak.com/' } }),
    )

    await page
      .getByText(
        'I understand that I’m using a third-party solution and Oasis* does not carry any responsibility over the usage of this solution.',
      )
      .click()
  })

  test('Content-Security-Policy should block unknown iframe and fail', async ({ page }) => {
    test.fail()
    expect((await page.request.head('/')).headers()).toHaveProperty('content-security-policy')
    await expectNoErrorsInConsole(page)
    await setup(page)
    await page.route('https://*.transak.com/*', route =>
      route.fulfill({ status: 301, headers: { Location: 'https://phishing-transak.com/' } }),
    )
    await page.route('https://phishing-transak.com/', route => route.fulfill({ body: `phishing` }))

    await Promise.all([
      page
        .getByText(
          'I understand that I’m using a third-party solution and Oasis* does not carry any responsibility over the usage of this solution.',
        )
        .click(),
      page.waitForRequest('https://phishing-transak.com/'),
    ])
  })

  test('Sandbox should block top-navigation from iframe and fail', async ({ page }) => {
    test.fail()
    await expectNoErrorsInConsole(page)
    await setup(page)
    await page.route('https://*.transak.com/*', route =>
      route.fulfill({
        body: `<script>window.top.location = 'https://phishing-wallet.com/';</script>`,
      }),
    )
    await page.route('https://phishing-wallet.com/', route => route.fulfill({ body: `phishing` }))

    await Promise.all([
      page
        .getByText(
          'I understand that I’m using a third-party solution and Oasis* does not carry any responsibility over the usage of this solution.',
        )
        .click(),
      page.waitForRequest('https://phishing-wallet.com/'),
    ])
    await expect(page).toHaveURL('https://phishing-wallet.com/')
  })

  test('Permissions-Policy should contain Transak permissions', async ({ page }) => {
    expect((await page.request.head('/')).headers()).toHaveProperty('permissions-policy')
    await expectNoErrorsInConsole(page)
    await setup(page)
    const permissionsPolicy = (await page.request.head('/'))
      .headers()
      ['permissions-policy'].split(',')
      .map(rule => rule.trim())

    await page
      .getByText(
        'I understand that I’m using a third-party solution and Oasis* does not carry any responsibility over the usage of this solution.',
      )
      .click()

    const transakPermissions = await page.locator('iframe').getAttribute('allow')
    expect(transakPermissions).toBeTruthy()

    for (const permission of transakPermissions!.split(';').map(permission => permission.trim())) {
      const rule = permissionsPolicy.find(rule => rule.startsWith(`${permission}=`))!
      expect(
        rule.endsWith('=*') ||
          (rule.includes('https://global.transak.com') && rule.includes('https://global-stg.transak.com')),
      ).toBeTruthy()
    }
  })
})
