import { render, screen } from '@testing-library/react'
import * as React from 'react'
import { Provider, useDispatch } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { LocationDescriptor } from 'history'
import { configureAppStore } from 'store/configureStore'

import { AccountPage } from '..'
import { DeepPartialRootState } from 'types/RootState'
import { stakingActions } from 'app/state/staking'
import { WalletErrors } from 'types/errors'

jest.unmock('react-i18next')
jest.mock('qrcode.react', () => ({
  QRCodeCanvas: () => <>QRCodeCanvasMock</>,
}))
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

const renderPage = (store: any, initialEntries: LocationDescriptor[]) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/account/:address/*" element={<AccountPage />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )

describe('<AccountPage  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    // Ignore dispatches to fetch account from AccountPage
    jest.mocked(useDispatch).mockImplementation(() => jest.fn())

    const state: DeepPartialRootState = {
      account: {
        loading: false,
        address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
        available: 100000000000n.toString(),
        delegations: null,
        debonding: null,
        total: null,
        transactions: [],
        accountError: undefined,
        transactionsError: undefined,
      },
      staking: {
        delegations: [{ amount: 1111n.toString() }],
        debondingDelegations: [],
      },
      wallet: {
        isOpen: true,
        selectedWallet: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
        wallets: {
          oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk: {
            address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
          },
        },
      },
    }
    store = configureAppStore(state as any)
  })

  it('should match snapshot', async () => {
    const page = renderPage(store, ['/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'])
    const balance = await screen.findByTestId('account-balance-total')
    expect(balance).toHaveTextContent('100.000001111')
    expect(page.container.firstChild).toMatchSnapshot()
  })

  it('with missing delegations', async () => {
    store.dispatch(
      stakingActions.updateDelegationsError({
        code: WalletErrors.IndexerAPIError,
        message: 'Dummy error',
      }),
    )
    const page = renderPage(store, ['/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'])
    expect(page.container).toHaveTextContent('Oasis Scan API appears to be down')
    const balance = await screen.findByTestId('account-balance-total')
    expect(balance).toHaveTextContent('-')
    const balanceSummary = await screen.findByTestId('account-balance-summary')
    expect(balanceSummary.textContent).toMatchSnapshot()
    const tabs = await screen.findByRole('navigation')
    expect(tabs.textContent).toMatchSnapshot()
  })

  it('should sum total balance without losing precision', async () => {
    store = configureAppStore({
      ...store.getState(),
      account: {
        ...store.getState().account,
        available: 1563114365108133939632n.toString(),
      },
    })
    renderPage(store, ['/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'])
    const balance = await screen.findByTestId('account-balance-total')
    expect(balance).toHaveTextContent('1,563,114,365,108.133940743')
  })
})
