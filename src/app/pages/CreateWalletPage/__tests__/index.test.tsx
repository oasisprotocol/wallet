import * as React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { CreateWalletPage } from '..'
import { configureAppStore } from 'store/configureStore'
import { Provider } from 'react-redux'
import { hdkey } from '@oasisprotocol/client'
import * as bip39 from 'bip39'

const HDKey = hdkey.HDKey

jest.mock('react-i18next', () => ({
  Trans: ({ i18nKey }) => <>{i18nKey}</>,
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

const renderPage = store =>
  render(
    <Provider store={store}>
      <CreateWalletPage />
    </Provider>,
  )

describe('<CreateWalletPage  />', () => {
  let store: ReturnType<typeof configureAppStore>
  let generateMnemonicMock: jest.MockedFunction<any>

  beforeEach(() => {
    generateMnemonicMock = jest.spyOn(HDKey, 'generateMnemonic')
    store = configureAppStore()
    generateMnemonicMock.mockImplementation(() => {
      return new Array(24).fill('test').join(' ')
    })
    jest.spyOn(bip39, 'validateMnemonic').mockImplementation(() => true)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  // @todo this has a random mnemonic...
  it('should match snapshot', () => {
    const page = renderPage(store)
    expect(page.container.firstChild).toMatchSnapshot()
    expect(generateMnemonicMock).toHaveBeenCalledTimes(1)
  })

  it('can regenerate the keyphrase', () => {
    const { getByText } = renderPage(store)
    expect(generateMnemonicMock).toHaveBeenCalledTimes(1)

    fireEvent.click(getByText(/createWallet.newMnemonic/))
    expect(generateMnemonicMock).toHaveBeenCalledTimes(2)
  })
})
