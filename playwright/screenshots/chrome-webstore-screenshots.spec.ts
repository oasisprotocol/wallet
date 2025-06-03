import { extensionViewport } from '../utils/extensionTestExtend'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApiMoreData } from '../utils/mockApi'
import { ethAccount, privateKey } from '../../src/utils/__fixtures__/test-inputs'
import { test, expect, Page } from '@playwright/test'

const screenshotCss = `
  * { scrollbar-width: none; }
  [data-testid="build-banner"] { display: none; }
`

const chromeWebStoreDimensions = {
  width: 1280,
  height: 800,
}

/** Scale for higher quality larger screenshots */
const deviceScaleFactor = chromeWebStoreDimensions.height / extensionViewport.height
test.use({
  deviceScaleFactor: deviceScaleFactor,
  viewport: {
    width: Math.round(chromeWebStoreDimensions.width / deviceScaleFactor),
    height: Math.round(chromeWebStoreDimensions.height / deviceScaleFactor),
  },
})

async function setup(page: Page, url: string) {
  await page.goto('/app.webmanifest')
  await page.setContent(`
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      iframe {
        width: ${extensionViewport.width}px;
        height: ${extensionViewport.height * 0.975}px;
        border: 5px solid #0500e2;
      }
    </style>
    <body style="">
      <iframe src="${url}"></iframe>
    </body>
  `)
  return page.frameLocator('iframe')!
}

test.beforeEach(async ({ context }) => {
  await warnSlowApi(context)
  await mockApiMoreData(context)
})

test('make screenshots for Chrome Web Store', async ({ page }) => {
  expect(page.viewportSize()!.width * deviceScaleFactor).toBe(chromeWebStoreDimensions.width)
  expect(page.viewportSize()!.height * deviceScaleFactor).toBe(chromeWebStoreDimensions.height)

  const frame = await setup(page, `/`)
  await page.screenshot({
    path: './screenshots/extension-store-1.png',
    style: screenshotCss,
    animations: 'disabled',
    omitBackground: true,
  })

  await frame.getByRole('button', { name: /Open wallet/ }).click()
  await frame.getByRole('button', { name: /Private key/ }).click()
  await frame.getByText('Create a profile').uncheck()
  await frame.getByPlaceholder('Enter your private key here').fill(privateKey)
  await page.keyboard.press('Enter')
  await expect(frame.getByText('Loading account')).toBeVisible()
  await expect(frame.getByText('Loading account')).toBeHidden()
  await page.screenshot({
    path: './screenshots/extension-store-2.png',
    style: screenshotCss,
    animations: 'disabled',
    omitBackground: true,
  })

  await frame.getByRole('link', { name: 'Stake' }).click()
  await frame.getByRole('columnheader', { name: 'Name' }).click()
  await frame.getByRole('img', { name: 'Status is okay' }).nth(3).click()
  await frame.getByRole('link', { name: 'Staked' }).scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)
  await page.screenshot({
    path: './screenshots/extension-store-3.png',
    style: screenshotCss,
    animations: 'disabled',
    omitBackground: true,
  })

  await frame.getByRole('link', { name: 'Staked' }).click()
  await page.screenshot({
    path: './screenshots/extension-store-4.png',
    style: screenshotCss,
    animations: 'disabled',
    omitBackground: true,
  })

  await frame.getByRole('link', { name: 'ParaTimes' }).click()
  await page.evaluate(() => {
    window.frames[0].scrollBy(0, 10000)
  })
  await page.screenshot({
    path: './screenshots/extension-store-5.png',
    style: screenshotCss,
    animations: 'disabled',
    omitBackground: true,
  })

  await frame.getByRole('button', { name: 'Deposit to ParaTime' }).click()
  await frame.getByRole('button', { name: 'Select a ParaTime' }).click()
  await page.screenshot({
    path: './screenshots/extension-store-6.png',
    style: screenshotCss,
    animations: 'disabled',
    omitBackground: true,
  })

  await frame.getByRole('option', { name: 'Sapphire' }).click()
  await frame.getByRole('button', { name: 'Next' }).click()
  await frame.getByRole('textbox', { name: 'recipient' }).fill(ethAccount.address)
  await frame.getByRole('button', { name: 'Next' }).click()

  await frame.getByRole('textbox', { name: 'amount' }).fill('10.0')
  await page.screenshot({
    path: './screenshots/extension-store-7.png',
    style: screenshotCss,
    animations: 'disabled',
    omitBackground: true,
  })

  await frame.getByRole('button', { name: 'Next' }).click()
  await page.screenshot({
    path: './screenshots/extension-store-8.png',
    style: screenshotCss,
    animations: 'disabled',
    omitBackground: true,
  })
})
