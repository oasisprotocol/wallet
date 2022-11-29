import { render } from '@testing-library/react'
import { WalletType } from 'app/state/wallet/types'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'

import { Account } from '..'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Account
          address="oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe"
          balance={1000n.toString()}
          type={WalletType.Mnemonic}
          onClick={() => {}}
          isActive={false}
          displayCheckbox={true}
          displayAccountNumber={true}
          details="m/44'/474'/0'/0'/0'"
        />
      </ThemeProvider>
    </Provider>,
  )

describe('<Account  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({})
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.baseElement).toMatchSnapshot()
  })
})
