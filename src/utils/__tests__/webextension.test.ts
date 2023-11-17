import browser from 'webextension-polyfill'
import { openLedgerAccessPopup } from '../webextension'

jest.mock('webextension-polyfill', () => ({
  extension: {
    getViews: jest.fn(),
  },
  runtime: {
    getManifest: jest.fn(),
    getURL: jest.fn(),
  },
  windows: {
    create: jest.fn(),
  },
}))

describe('openLedgerAccessPopup', () => {
  it('should open a new popup window', () => {
    jest.mocked(browser.extension.getViews).mockReturnValue([])
    jest.mocked(browser.runtime.getManifest).mockReturnValue({
      browser_action: { default_popup: 'popup.foo.html' },
      manifest_version: 2,
      name: '',
      version: '',
    })
    jest.mocked(browser.runtime.getURL).mockReturnValue('mockedUrl')
    openLedgerAccessPopup('#/foo')

    expect(browser.runtime.getURL).toHaveBeenCalledWith('popup.foo.html#/foo')
    expect(browser.windows.create).toHaveBeenCalledWith({
      height: 850,
      type: 'normal',
      url: 'mockedUrl',
      width: 600,
    })
  })
})
