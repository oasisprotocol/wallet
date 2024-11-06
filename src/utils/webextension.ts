import browser from 'webextension-polyfill'

type Props = {
  path: string
  height: number
  width: number
  type?: browser.Windows.CreateType
}

export const getPopupUrl = (path: string) =>
  browser.runtime.getURL(`${browser.runtime.getManifest()?.action?.default_popup}${path}`)

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
    focused: true,
  })
  await browser.windows.update(popup.id!, { focused: true }) // Focus again. Helps in rare cases like when screensharing.
}

export const openLedgerAccessPopup = (path: string) => {
  openPopup({
    path: path,
    width: 600,
    height: 850,

    // Override type:popup because Chrome no longer shows permissions dialog in popups
    // Mentioned in https://bugs.chromium.org/p/chromium/issues/detail?id=1415183#c14
    // Maybe related to https://bugs.chromium.org/p/chromium/issues/detail?id=1360960
    type: 'normal',
  })
}
