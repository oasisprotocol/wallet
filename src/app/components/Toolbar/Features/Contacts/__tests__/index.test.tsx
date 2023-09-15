import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { Wallet } from 'app/state/wallet/types'
import { PersistState } from 'app/state/persist/types'
import { Contacts } from '../'

// needed to test Trans component
jest.unmock('react-i18next')

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider>
          <Contacts closeHandler={() => {}} />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
  )

describe('<Contacts  />', () => {
  let store: ReturnType<typeof configureAppStore>

  const unlockedProfile = {
    wallet: {
      selectedWallet: 'dummy',
      wallets: {
        dummy: {
          address: 'dummy',
        } as Wallet,
      },
    },
    persist: {
      hasPersistedProfiles: true,
      stringifiedEncryptionKey: 'unlockedProfile',
    } as PersistState,
  }

  beforeEach(() => {
    store = configureAppStore(unlockedProfile)
  })

  it('should render unavailable state', () => {
    renderComponent(configureAppStore({}))
    expect(screen.getByText(/To start adding contacts create a profile while/)).toBeInTheDocument()
    expect(screen.queryByText('Add Contact')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'opening a wallet' })).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    const storeWithContacts = configureAppStore({
      ...unlockedProfile,
      contacts: {
        oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4: {
          address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
          name: 'My Contact',
        },
      },
    })
    const { container } = renderComponent(storeWithContacts)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should render empty state', () => {
    renderComponent(store)
    expect(screen.getByText('You have no contacts yet.')).toBeInTheDocument()
    expect(screen.getByText('Add Contact')).toBeInTheDocument()
    expect(screen.queryByTestId('account-choice')).not.toBeInTheDocument()
  })

  it('should show Add Contact form overlay', async () => {
    renderComponent(store)
    await userEvent.click(screen.getByRole('button', { name: 'Add Contact' }))
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument()
  })
})
