import browser from 'webextension-polyfill'

type Dimensions = {
  height: number
  width: number
}

const getExtensionUrl = (path: string) =>
  browser.runtime.getURL(`${browser.runtime.getManifest()?.browser_action?.default_popup}${path}`)

const openPopup = (path: string, dimensions: Dimensions) => {
  browser.windows.create({
    url: getExtensionUrl(path),
    type: 'popup',
    width: dimensions.width,
    height: dimensions.height,
  })
}

export const openLedgerAccessPopup = (path: string) => openPopup(path, { width: 500, height: 650 })
