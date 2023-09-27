import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { Wallet } from 'app/state/wallet/types'
import { PersistState } from 'app/state/persist/types'
import { Profile } from '../'

const closeHandler = jest.fn()
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))
// needed to test Trans component
jest.unmock('react-i18next')

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider>
          <Profile closeHandler={closeHandler} />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
  )

describe('<Profile  />', () => {
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
    const { container } = renderComponent(store)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should render unavailable state', async () => {
    renderComponent(configureAppStore({}))
    expect(screen.getByText(/You can setup your profile while/)).toBeInTheDocument()
    expect(screen.queryByText('Update Profile')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'opening a wallet' }))
    expect(mockNavigate).toHaveBeenCalledWith('/open-wallet')
    expect(closeHandler).toHaveBeenCalled()
  })
})
