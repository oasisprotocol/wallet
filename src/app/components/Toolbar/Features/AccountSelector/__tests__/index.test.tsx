import { render } from '@testing-library/react'
import { WalletType } from 'app/state/wallet/types'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'

import { AccountSelector } from '..'
import type { UseTranslationResponse } from 'react-i18next'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <AccountSelector closeHandler={() => {}} />
      </ThemeProvider>
    </Provider>,
  )

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    } as UseTranslationResponse<'translation'>
  },
}))

describe('<AccountSelector  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({
      wallet: {
        isOpen: true,
        wallets: {
          1: {
            address: 'dummy',
            balance: { available: '100', debonding: '0', escrow: '0', total: '100' },
            id: 1,
            publicKey: '00',
            type: WalletType.Ledger,
          },
        },
      },
    })
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.container.firstChild).toMatchSnapshot()
  })
})
