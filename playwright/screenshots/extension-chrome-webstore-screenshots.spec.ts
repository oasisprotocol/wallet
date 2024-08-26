import { test, extensionViewport } from '../utils/extensionTestExtend'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'
import { fillPrivateKeyWithoutPassword } from '../utils/fillPrivateKey'
import { privateKey, privateKeyAddress } from '../../src/utils/__fixtures__/test-inputs'

const screenshotCss = `
  * { scrollbar-width: none; }
  [data-testid="build-banner"] { display: none; }
`

const chromeWebStoreDimensions = {
  width: 1200,
  height: 800,
}

/** Scale for higher quality larger screenshots */
const deviceScaleFactor = (chromeWebStoreDimensions.height - 20) / extensionViewport.height

test.use({ deviceScaleFactor })

test.beforeEach(async ({ context }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
})

test.describe('make screenshots for Chrome Web Store', () => {
  test('start screen', async ({ page, extensionPopupURL, extensionManifestURL }) => {
    await page.goto(extensionManifestURL)
    await page.setViewportSize({
      width: Math.round(chromeWebStoreDimensions.width / deviceScaleFactor),
      height: Math.round(chromeWebStoreDimensions.height / deviceScaleFactor),
    })

    await page.setContent(`
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #e6e6e6;
        }
        iframe {
          width: ${extensionViewport.width}px;
          height: ${extensionViewport.height}px;
          border: 5px solid #0500e2;
        }
      </style>
      <body style="">
        <iframe src="${extensionPopupURL}/"></iframe>
      </body>
    `)
    await page.screenshot({
      path: './screenshots/extension-store-1.png',
      style: screenshotCss,
    })
  })
})
