import browser from 'webextension-polyfill'

type Dimensions = {
  height: number
  width: number
}

const openPopup = (url: string, dimensions: Dimensions) => {
  browser.windows.create({
    url,
    type: 'popup',
    width: dimensions.width,
    height: dimensions.height,
  })
}
