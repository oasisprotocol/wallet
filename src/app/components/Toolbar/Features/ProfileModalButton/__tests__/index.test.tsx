import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { configureAppStore } from 'store/configureStore'
import { Wallet } from 'app/state/wallet/types'
import { PersistState } from 'app/state/persist/types'
import { persistActions } from 'app/state/persist'
import { ProfileModalButton } from '..'
import { addressToJazzIconSeed } from '../addressToJazzIconSeed'

const state = {
  wallet: {
    selectedWallet: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
    wallets: {
      dummy: {
        address: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
      } as Wallet,
    },
  },
  persist: {
    hasPersistedProfiles: true,
    stringifiedEncryptionKey: 'unlockedProfile',
  } as PersistState,
}

const renderComponent = (store: any, responsiveContext: string) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider>
          <ResponsiveContext.Provider value={responsiveContext}>
            <ProfileModalButton />
          </ResponsiveContext.Provider>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
  )

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('<ProfileModalButton  />', () => {
  let store: ReturnType<typeof configureAppStore>

  it.skip('should match snapshot', () => {
    const component = render(<ProfileModalButton />)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('addressToJazzIconSeed for JazzIcon should return the same value as extension wallet', () => {
    expect(addressToJazzIconSeed('oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe')).toBe(-323287268)
    expect(addressToJazzIconSeed('oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')).toBe(-77419490)
  })

  it('should render Lock button on mobile', async () => {
    store = configureAppStore(state)
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store, 'small')

    await userEvent.click(screen.getByTestId('account-selector'))
    await userEvent.click(screen.getByTestId('profile-modal-lock-wallet'))
    expect(spy).toHaveBeenCalledWith({
      type: persistActions.lockAsync.type,
    })
  })

  it('should render Close button on mobile', async () => {
    store = configureAppStore({
      ...state,
      persist: {
        hasPersistedProfiles: false,
        stringifiedEncryptionKey: 'openUnpersisted',
      } as PersistState,
    })
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store, 'small')

    await userEvent.click(screen.getByTestId('account-selector'))
    await userEvent.click(screen.getByTestId('profile-modal-close-wallet'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
    expect(spy).toHaveBeenCalledWith({
      type: persistActions.lockAsync.type,
    })
  })
})
