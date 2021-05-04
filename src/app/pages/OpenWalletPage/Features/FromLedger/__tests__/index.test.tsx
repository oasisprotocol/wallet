import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ledgerActions } from 'app/state/ledger'
import { LedgerStep } from 'app/state/ledger/types'
import { walletActions } from 'app/state/wallet'
import * as React from 'react'
import { Provider, useDispatch } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { FromLedger } from '..'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
  useDispatch: jest.fn(),
}))

const renderComponent = (store, abortFunction = () => {}) =>
  render(
    <Provider store={store}>
      <FromLedger abort={abortFunction} />
    </Provider>,
  )

describe('<FromLedger  />', () => {
  let store: ReturnType<typeof configureAppStore>
  let mockDispatch = useDispatch as jest.Mock<typeof useDispatch>

  beforeEach(() => {
    store = configureAppStore()
    mockDispatch.mockImplementation(() => jest.fn())
  })

  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    cleanup()
    document.body.innerHTML = ''
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component).toMatchSnapshot()
    screen.getByTestId('ledger-open-accounts')
  })

  it('should list the accounts when done', () => {
    const component = renderComponent(store)
    store.dispatch(
      ledgerActions.accountsListed([
        {
          address: 'oasis1abcdefghijkl',
          balance: { available: '0', debonding: '0', escrow: '0', total: '0' },
          path: [44, 474, 0],
          publicKey: '00',
          selected: false,
        },
      ]),
    )

    store.dispatch(ledgerActions.setStep(LedgerStep.Done))
    expect(component.getByText('oasis1 abcd efgh ijkl')).toBeInTheDocument()
  })

  it('should open the selected accounts', () => {
    const dispatchFn = jest.fn()
    mockDispatch.mockImplementation(() => dispatchFn)

    const component = renderComponent(store)
    store.dispatch(
      ledgerActions.accountsListed([
        {
          address: 'oasis1aaaaaaaa',
          balance: { available: '0', debonding: '0', escrow: '0', total: '0' },
          path: [44, 474, 0],
          publicKey: '00',
          selected: false,
        },
        {
          address: 'oasis1bbbbbbbb',
          balance: { available: '0', debonding: '0', escrow: '0', total: '0' },
          path: [44, 474, 1],
          publicKey: '00',
          selected: false,
        },
      ]),
    )

    store.dispatch(ledgerActions.setStep(LedgerStep.Done))
    userEvent.click(screen.getByText('oasis1 aaaa aaaa'))
    expect(dispatchFn).toHaveBeenLastCalledWith({ payload: 0, type: ledgerActions.toggleAccount.type })
    store.dispatch(ledgerActions.toggleAccount(0))

    userEvent.click(screen.getByTestId('ledger-open-accounts'))
    expect(dispatchFn).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: walletActions.openWalletsFromLedger.type }),
    )
  })
})
