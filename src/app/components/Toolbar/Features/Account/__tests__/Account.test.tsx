import { render, screen } from '@testing-library/react'
import { WalletType } from 'app/state/wallet/types'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { Account, AccountProps } from '../Account'

const props = {
  address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
  balance: { available: '200', debonding: '0', delegations: '800', total: '1000', nonce: '0' },
  onClick: () => {},
  isActive: false,
  displayBalance: true,
  displayCheckbox: true,
  displayAccountNumber: true,
  path: [44, 474, 0, 0, 0],
  displayDerivation: {
    type: WalletType.Mnemonic,
    pathDisplay: "m/44'/474'/0'/0'/0'",
  },
  name: 'My Account',
}

const renderComponent = (store: any, props: AccountProps) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Account {...props} />
      </ThemeProvider>
    </Provider>,
  )

describe('<Account  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({})
  })

  it('should match snapshot', () => {
    const component = renderComponent(store, props)
    expect(component.baseElement).toMatchSnapshot()
  })

  it('should render without name', () => {
    const propsWithoutName = { ...props, name: undefined }
    renderComponent(store, propsWithoutName)
    expect(screen.queryByTestId('account-name')).not.toBeInTheDocument()
  })
})
