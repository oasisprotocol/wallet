import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { paraTimesActions } from 'app/state/paratimes'
import { TransactionForm } from 'app/state/paratimes/types'
import { useParaTimes, ParaTimesHook } from '../../useParaTimes'
import { useParaTimesNavigation, ParaTimesNavigationHook } from '../../useParaTimesNavigation'
import { TransactionAmount } from '..'
import { ParaTime } from 'config'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}))
jest.unmock('react-i18next')
jest.mock('../../useParaTimes')
jest.mock('../../useParaTimesNavigation')

describe('<TransactionAmount />', () => {
  const mockUseParaTimesResult = {
    balance: '1000000000',
    balanceInBaseUnit: true,
    isDepositing: true,
    isEvmcParaTime: false,
    isWalletEmpty: false,
    paraTimeName: 'Cipher',
    paraTimeConfig: { gasPrice: 5n, feeGas: 500_000n, decimals: 9 },
    ticker: 'ROSE',
    transactionForm: {
      amount: '',
      recipient: 'dummyAddress',
      paraTime: ParaTime.Cipher,
      ethPrivateKey: 'ethPrivateKey',
    },
    usesOasisAddress: true,
  } as ParaTimesHook
  const mockUseParaTimesNavigationResult = {} as ParaTimesNavigationHook

  beforeEach(() => {
    jest.mocked(useParaTimes).mockReturnValue(mockUseParaTimesResult)
    jest.mocked(useParaTimesNavigation).mockReturnValue(mockUseParaTimesNavigationResult)
  })

  it('should render component', () => {
    const { container } = render(<TransactionAmount />)

    expect(container).toMatchSnapshot()
  })

  it('should render EVMc withdraw variant component', () => {
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      isDepositing: false,
      isEvmcParaTime: true,
      paraTimeName: 'Emerald',
    } as ParaTimesHook)
    render(<TransactionAmount />)

    expect(screen.getByTestId('paraTime-content-description')).toMatchSnapshot()
  })

  it('should render collapsible Advance section', async () => {
    render(<TransactionAmount />)

    await userEvent.click(screen.getByRole('button', { name: 'Advanced' }))
    expect(screen.getByPlaceholderText('Fee Amount (nano ROSE)')).toBeVisible()
    expect(screen.getByPlaceholderText('Fee Gas')).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Advanced' }))
    expect(screen.getByPlaceholderText('Fee Amount (nano ROSE)')).not.toBeVisible()
    expect(screen.getByPlaceholderText('Fee Gas')).not.toBeVisible()
  })

  it('should render disabled variant', () => {
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      balance: '0',
      isWalletEmpty: true,
    } as ParaTimesHook)
    render(<TransactionAmount />)

    expect(screen.getByText('The wallet is empty. There is nothing to withdraw.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'MAX' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('should set input value to max', async () => {
    const setTransactionForm = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({ ...mockUseParaTimesResult, setTransactionForm })
    const { rerender } = render(<TransactionAmount />)

    await userEvent.click(screen.getByRole('button', { name: 'MAX' }))
    expect(setTransactionForm).toHaveBeenNthCalledWith(1, expect.objectContaining({ amount: '1' }))

    jest
      .mocked(useParaTimes)
      .mockReturnValue({ ...mockUseParaTimesResult, setTransactionForm, balance: '1563114365108133939632' })
    rerender(<TransactionAmount />)

    await userEvent.click(screen.getByRole('button', { name: 'MAX' }))
    expect(setTransactionForm).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ amount: '1563114365108.133939632' }),
    )
  })

  it('should require amount field on form submit', async () => {
    const navigateToConfirmation = jest.fn()
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToConfirmation,
    })
    render(<TransactionAmount />)

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Field is required')).toBeInTheDocument()
    expect(navigateToConfirmation).not.toHaveBeenCalled()
  })

  it('should validate amount field on form submit', async () => {
    const navigateToConfirmation = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      transactionForm: {
        amount: '10000000000000',
      },
    } as ParaTimesHook)
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToConfirmation,
    })
    render(<TransactionAmount />)

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Insufficient balance')).toBeInTheDocument()
    expect(navigateToConfirmation).not.toHaveBeenCalled()
  })

  it('should validate amount and fee on form submit', async () => {
    const navigateToConfirmation = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      transactionForm: {
        amount: '1',
        feeAmount: '2500000',
      },
    } as ParaTimesHook)
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToConfirmation,
    })
    render(<TransactionAmount />)

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Insufficient balance to pay the fee')).toBeInTheDocument()
    expect(navigateToConfirmation).not.toHaveBeenCalled()
  })

  it('should navigate to confirmation step when amount is valid', async () => {
    const setTransactionForm = jest.fn()
    const navigateToConfirmation = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      transactionForm: {
        amount: '1',
      } as TransactionForm,
      setTransactionForm,
    } as ParaTimesHook)
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToConfirmation,
    })
    render(<TransactionAmount />)

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(setTransactionForm).toHaveBeenCalledWith(
      expect.objectContaining({ amount: '1', defaultFeeAmount: '0' }),
    )
    expect(navigateToConfirmation).toHaveBeenCalled()
  })

  it('should fetch non EVMc paraTime balance', () => {
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      isDepositing: false,
    } as ParaTimesHook)
    render(<TransactionAmount />)

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: paraTimesActions.fetchBalanceUsingOasisAddress.type,
    })
  })

  it('should fetch EVMc paraTime balance', () => {
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      isDepositing: false,
      isEvmcParaTime: true,
      transactionForm: {
        ...mockUseParaTimesResult.transactionForm,
        paraTime: ParaTime.Emerald,
      },
    } as ParaTimesHook)
    render(<TransactionAmount />)

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: paraTimesActions.fetchBalanceUsingEthPrivateKey.type,
    })
  })
})
