import browser from 'webextension-polyfill'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ExtLedgerAccessPopup } from '../../extension/src/ExtLedgerAccessPopup/ExtLedgerAccessPopup'

type Props = {
  path: string
  height: number
  width: number
  type?: browser.Windows.CreateType
}

const openPopup = async ({ path, height, width, type }: Props) => {
  const existingPopupWindow = browser.extension.getViews().find(window => window.location.href === path)

  if (existingPopupWindow) {
    existingPopupWindow.close()
  }
  const popup = await browser.windows.create({
    url: path,
    type: type ?? 'popup',
    width: width,
    height: height,
    left: Math.max(window.screenLeft + window.outerWidth - width, 0),
    top: Math.min(window.screenTop, window.screen.height - height),
    focused: true,
  })
  await browser.windows.update(popup.id!, { focused: true }) // Focus again. Helps in rare cases like when screensharing.
}

export const openLedgerAccessPopup = () => {
  /** See {@link ExtLedgerAccessPopup} */
  const href = new URL('../../extension/src/ExtLedgerAccessPopup/index.html', import.meta.url).href
  openPopup({
    path: href,
    width: 600,
    height: 850,

    // Override type:popup because Chrome no longer shows permissions dialog in popups
    // Mentioned in https://bugs.chromium.org/p/chromium/issues/detail?id=1415183#c14
    // Maybe related to https://bugs.chromium.org/p/chromium/issues/detail?id=1360960
    type: 'normal',
  })
}
