import browser from 'webextension-polyfill'

type Dimensions = {
  height: number
  width: number
}

const getPopupUrl = (path: string) =>
  browser.runtime.getURL(`${browser.runtime.getManifest()?.browser_action?.default_popup}${path}`)

const openPopup = (path: string, dimensions: Dimensions) => {
  const existingPopupWindow = browser.extension
    .getViews()
    .find(window => window.location.href === getPopupUrl(path))

  if (existingPopupWindow) {
    existingPopupWindow.close()
  }
  browser.windows.create({
    url: getPopupUrl(path),
    type: 'popup',
    width: dimensions.width,
    height: dimensions.height,
  })
}

export const openLedgerAccessPopup = (path: string) => openPopup(path, { width: 500, height: 650 })
