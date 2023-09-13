import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { AddressFormatter } from '../'

const address = 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4'
const renderComponent = (store: any, address: string) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <AddressFormatter address={address} />
      </ThemeProvider>
    </Provider>,
  )

describe('<AddressFormatter  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({
      contacts: {
        [address]: {
          address: address,
          name: 'My Contact',
        },
      },
    })
  })

  it('should match snapshot', () => {
    const { container } = renderComponent(store, address)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should render without a name container when Contacts list is empty', () => {
    const storeWithoutContacts = configureAppStore()
    renderComponent(storeWithoutContacts, address)
    expect(screen.queryByTestId('address-formatter-name')).not.toBeInTheDocument()
  })

  it('should render without a name container when address is not in Contacts', () => {
    renderComponent(store, 'oasis1qqurxkgavtcjjytneumeclx59ds3avjaqg7ftqph')
    expect(screen.queryByTestId('address-formatter-name')).not.toBeInTheDocument()
  })
})
