import { render } from '@testing-library/react'
import { WalletType } from 'app/state/wallet/types'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'

import { AccountSelector } from '..'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <AccountSelector closeHandler={() => {}} />
      </ThemeProvider>
    </Provider>,
  )

describe('<AccountSelector  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({
      wallet: {
        wallets: {
          oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe: {
            address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
            balance: { available: '100', debonding: '0', delegations: '0', total: '100' },
            publicKey: '00',
            type: WalletType.UsbLedger,
          },
        },
      },
    })
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.baseElement).toMatchSnapshot()
  })
})
