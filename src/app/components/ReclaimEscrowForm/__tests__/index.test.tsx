import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import { transactionActions } from 'app/state/transaction'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { WalletErrors } from 'types/errors'
import { ReclaimEscrowForm } from '..'
import { ThemeProvider } from '../../../../styles/theme/ThemeProvider'

const renderComponent = (store: any, address: string, maxAmount: string, maxShares: string) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <ReclaimEscrowForm address={address} maxAmount={maxAmount} maxShares={maxShares} />
      </ThemeProvider>
    </Provider>,
  )

describe('<ReclaimEscrowForm />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
    jest.resetAllMocks()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store, 'dummy-address', '1000', '1000')
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should render error indicator', () => {
    const storeWithError = configureAppStore({
      transaction: {
        active: true,
        error: {
          code: WalletErrors.NoOpenWallet,
          message: 'message',
        },
        success: false,
      },
    })

    renderComponent(storeWithError, 'dummy-address', '1000000000000', '1000000000000')

    expect(screen.getByText('errors.noOpenWallet')).toBeInTheDocument()
  })

  it('should display the number of shares', async () => {
    renderComponent(store, 'dummy-address', '1000000000000', '1000000000000')

    expect(screen.queryByTestId('numberOfShares')).toBeNull()
    await userEvent.type(screen.getByTestId('amount'), '500')
    expect(screen.getByTestId('numberOfShares')).toBeInTheDocument()
  })

  it('should submit the transaction', async () => {
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store, 'dummy-address', '2000000000000', '1000000000000')

    await userEvent.type(screen.getByTestId('amount'), '500')
    await userEvent.click(screen.getByRole('button', { name: 'account.reclaimEscrow.reclaim' }))

    expect(spy).toHaveBeenCalledWith({
      payload: {
        amount: '500000000000',
        shares: '250000000000',
        type: 'reclaimEscrow',
        validator: 'dummy-address',
      },
      type: 'transaction/reclaimEscrow',
    } as ReturnType<typeof transactionActions.reclaimEscrow>)
  })

  it('reclaim all should submit the transaction', async () => {
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store, 'dummy-address', '2000000000000', '1000000000000')
    await userEvent.click(screen.getByRole('button', { name: 'account.reclaimEscrow.reclaimAll' }))

    expect(spy).toHaveBeenCalledWith({
      payload: {
        amount: '2000000000000',
        shares: '1000000000000',
        type: 'reclaimEscrow',
        validator: 'dummy-address',
      },
      type: 'transaction/reclaimEscrow',
    } as ReturnType<typeof transactionActions.reclaimEscrow>)
  })

  it('reclaim all should work without losing precision', async () => {
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store, 'dummy-address', '1655615038322038833148', '1563114365108133939632')
    await userEvent.click(screen.getByRole('button', { name: 'account.reclaimEscrow.reclaimAll' }))

    expect(spy).toHaveBeenCalledWith({
      payload: {
        amount: '1655615038322038833148',
        shares: '1563114365108133939632',
        type: 'reclaimEscrow',
        validator: 'dummy-address',
      },
      type: 'transaction/reclaimEscrow',
    })
  })

  it('should round up max input limit when losing precision', async () => {
    renderComponent(
      store,
      'dummy-address',
      parseRoseStringToBaseUnitString('1655615038322.038833148'),
      '1000',
    )
    const amountInput = await screen.findByPlaceholderText('common.amount')
    expect(amountInput).toHaveAttribute('max', '1655615038322.04')
  })
})
