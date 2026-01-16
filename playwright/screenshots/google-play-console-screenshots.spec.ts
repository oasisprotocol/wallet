import { test, expect, Page, FrameLocator } from '@playwright/test'
import { extensionViewport } from '../utils/extensionTestExtend'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApiMoreData } from '../utils/mockApi'
import { ethAccount, privateKey } from '../../src/utils/__fixtures__/test-inputs'

const screenshotCss = `
  * { scrollbar-width: none; }
  [data-testid="build-banner"] { display: none; }
`

const mobileViewports = [
  {
    name: 'mobile',
    dims: { width: 1080, height: 1920 },
    setup: { width: 320, height: 585 },
  },
  {
    name: 'tablet-7inch',
    dims: { width: 1920, height: 1080 },
    setup: { width: 900, height: 550 },
  },
  {
    name: 'tablet-10inch',
    dims: { width: 2560, height: 1440 },
    setup: { width: 1000, height: 580 },
  },
]

async function setup(page: Page, url: string, viewportWidth: number, viewportHeight?: number) {
  const iframeHeight = viewportHeight || extensionViewport.height * 0.975
  await page.goto('/app.webmanifest')
  await page.setContent(`
    <style>
      body { display: flex; justify-content: center; align-items: center; height: 100vh; }
      iframe { width: ${viewportWidth}px; height: ${iframeHeight}px; border: 5px solid #0500e2; }
    </style>
    <body><iframe src="${url}"></iframe></body>
  `)
  return page.frameLocator('iframe')!
}

async function runScreenshotFlow(page: Page, frame: FrameLocator, deviceName: string) {
  const takeScreenshot = async (step: number) => {
    await page.screenshot({
      path: `./screenshots/play-console-${deviceName}-${step}.png`,
      style: screenshotCss,
      animations: 'disabled',
      omitBackground: true,
    })
  }

  await takeScreenshot(1)

  await frame.getByRole('button', { name: /Open wallet/ }).click()
  await frame.getByRole('button', { name: /Private key/ }).click()
  await frame.getByText('Create a profile').uncheck()
  await frame.getByPlaceholder('Enter your private key here').fill(privateKey)
  await page.keyboard.press('Enter')
  await expect(frame.getByText('Loading account')).toBeVisible()
  await expect(frame.getByText('Loading account')).toBeHidden()
  await takeScreenshot(2)

  await frame.getByRole('link', { name: 'Stake' }).click()
  await frame.getByRole('columnheader', { name: 'Name' }).click()
  await frame.getByRole('img', { name: 'Status is okay' }).nth(3).click()
  await frame.getByRole('link', { name: 'Staked' }).scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)
  await takeScreenshot(3)

  await frame.getByRole('link', { name: 'Staked' }).click()
  await takeScreenshot(4)

  await frame.getByRole('link', { name: 'ParaTimes' }).click()
  await page.evaluate(() => window.frames[0].scrollBy(0, 10000))
  await takeScreenshot(5)

  await frame.getByRole('button', { name: 'Deposit to ParaTime' }).click()
  await frame.getByRole('button', { name: 'Select a ParaTime' }).click()
  await takeScreenshot(6)

  await frame.getByRole('option', { name: 'Sapphire' }).click()
  await frame.getByRole('button', { name: 'Next' }).click()
  await frame.getByRole('textbox', { name: 'recipient' }).fill(ethAccount.address)
  await frame.getByRole('button', { name: 'Next' }).click()
  await frame.getByRole('textbox', { name: 'amount' }).fill('10.0')
  await takeScreenshot(7)

  await frame.getByRole('button', { name: 'Next' }).click()
  await takeScreenshot(8)
}

for (const viewport of mobileViewports) {
  test.describe(`Google Play Console ${viewport.name} screenshots`, () => {
    const scaleFactor = viewport.dims.height / extensionViewport.height

    test.use({
      deviceScaleFactor: scaleFactor,
      viewport: {
        width: Math.round(viewport.dims.width / scaleFactor),
        height: Math.round(viewport.dims.height / scaleFactor),
      },
    })

    test.beforeEach(async ({ context }) => {
      await warnSlowApi(context)
      await mockApiMoreData(context)
    })

    test(`make screenshots for ${viewport.name}`, async ({ page }) => {
      const frame = await setup(page, `/`, viewport.setup.width, viewport.setup.height)
      await runScreenshotFlow(page, frame, viewport.name)
    })
  })
}
