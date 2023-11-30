import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { importAccountsActions } from 'app/state/importaccounts'
import { ImportAccountsStep } from 'app/state/importaccounts/types'
import { walletActions } from 'app/state/wallet'
import * as React from 'react'
import { Provider, useDispatch } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { WalletType } from 'app/state/wallet/types'
import { ImportAccountsSelectionModal } from '..'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

const renderComponent = (store: any, abortFunction = () => {}) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <ImportAccountsSelectionModal abort={abortFunction} type={WalletType.UsbLedger} />
      </ThemeProvider>
    </Provider>,
  )

describe('<ImportAccountsSelectionModal  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
    jest.mocked(useDispatch).mockImplementation(() => jest.fn())
  })

  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    cleanup()
    document.body.innerHTML = ''
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.baseElement).toMatchSnapshot()
    screen.getByTestId('ledger-open-accounts')
  })

  it('should list the accounts when done', () => {
    const component = renderComponent(store)
    act(() => {
      store.dispatch(
        importAccountsActions.accountsListed([
          {
            address: 'oasis1qzyqaxestzlum26e2vdgvkerm6d9qgdp7gh2pxqe',
            balance: { available: '0', debonding: '0', delegations: '0', total: '0' },
            path: [44, 474, 0],
            pathDisplay: `m/44'/474'/0'`,
            publicKey: '00',
            selected: false,
            type: WalletType.Mnemonic,
          },
        ]),
      )

      store.dispatch(importAccountsActions.setStep(ImportAccountsStep.Idle))
    })
    expect(component.getByText('oasis1qzyq...7gh2pxqe')).toBeInTheDocument()
  })

  it('should open the selected accounts', async () => {
    const dispatchFn = jest.fn()
    jest.mocked(useDispatch).mockImplementation(() => dispatchFn)

    renderComponent(store)
    act(() => {
      store.dispatch(
        importAccountsActions.accountsListed([
          {
            address: 'oasis1qzyqaxestzlum26e2vdgvkerm6d9qgdp7gh2pxqe',
            balance: { available: '0', debonding: '0', delegations: '0', total: '0' },
            path: [44, 474, 0],
            pathDisplay: `m/44'/474'/0'`,
            publicKey: '00',
            selected: false,
            type: WalletType.Mnemonic,
          },
          {
            address: 'oasis1qqv25adrld8jjquzxzg769689lgf9jxvwgjs8tha',
            balance: { available: '0', debonding: '0', delegations: '0', total: '0' },
            path: [44, 474, 1],
            pathDisplay: `m/44'/474'/1'`,
            publicKey: '00',
            selected: false,
            type: WalletType.Mnemonic,
          },
        ]),
      )

      store.dispatch(importAccountsActions.setStep(ImportAccountsStep.Idle))
    })
    await userEvent.click(screen.getByText('oasis1qzyq...7gh2pxqe'))
    expect(dispatchFn).toHaveBeenLastCalledWith({
      payload: 'oasis1qzyqaxestzlum26e2vdgvkerm6d9qgdp7gh2pxqe',
      type: importAccountsActions.toggleAccount.type,
    })
    act(() => {
      store.dispatch(importAccountsActions.toggleAccount('oasis1qzyqaxestzlum26e2vdgvkerm6d9qgdp7gh2pxqe'))
    })
    await userEvent.click(screen.getByTestId('ledger-open-accounts'))
    expect(dispatchFn).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: walletActions.openWalletsFromLedger.type }),
    )
  })
})
