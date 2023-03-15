import browser from 'webextension-polyfill'

type Props = {
  path: string
  height: number
  width: number
}

const getPopupUrl = (path: string) =>
  browser.runtime.getURL(`${browser.runtime.getManifest()?.browser_action?.default_popup}${path}`)

const openPopup = ({ path, height, width }: Props) => {
  const existingPopupWindow = browser.extension
    .getViews()
    .find(window => window.location.href === getPopupUrl(path))

  if (existingPopupWindow) {
    existingPopupWindow.close()
  }
  browser.windows.create({
    url: getPopupUrl(path),
    type: 'popup',
    width: width,
    height: height,
  })
}

export const openLedgerAccessPopup = (path: string) => {
  openPopup({
    path: path,
    width: 500,
    height: 650,
  })
}
