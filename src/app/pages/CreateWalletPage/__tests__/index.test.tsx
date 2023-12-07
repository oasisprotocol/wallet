import * as React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { CreateWalletPage } from '..'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { Provider } from 'react-redux'
import { hdkey } from '@oasisprotocol/client'
import * as bip39 from 'bip39'

const HDKey = hdkey.HDKey
const renderPage = (store: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <CreateWalletPage />
      </ThemeProvider>
    </Provider>,
  )

describe('<CreateWalletPage  />', () => {
  let store: ReturnType<typeof configureAppStore>
  let generateMnemonicMock: jest.SpiedFunction<(typeof HDKey)['generateMnemonic']>

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

  it('should match snapshot', () => {
    const { container, getByText } = renderPage(store)
    fireEvent.click(getByText(/createWallet.newMnemonic/))
    expect(container.firstChild).toMatchSnapshot()
  })

  it('can regenerate the keyphrase', () => {
    const { getByText } = renderPage(store)
    fireEvent.click(getByText(/createWallet.newMnemonic/))
    expect(generateMnemonicMock).toHaveBeenCalledTimes(1)

    fireEvent.click(getByText(/createWallet.newMnemonic/))
    expect(generateMnemonicMock).toHaveBeenCalledTimes(2)
  })
})
