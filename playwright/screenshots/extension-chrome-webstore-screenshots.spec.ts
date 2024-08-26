import { test, extensionViewport } from '../utils/extensionTestExtend'
import { warnSlowApi } from '../utils/warnSlowApi'
import { mockApi } from '../utils/mockApi'

test.beforeEach(async ({ context }) => {
  await warnSlowApi(context)
  await mockApi(context, 0)
})

test.describe('make screenshots for Chrome Web Store', () => {
  test('start screen', async ({ page, extensionPopupURL, extensionManifestURL }) => {
    await page.goto(extensionManifestURL)
  })
})
