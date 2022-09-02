import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { paraTimesActions } from 'app/state/paratimes'
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
    ticker: 'ROSE',
    transactionForm: {
      amount: '',
      recipient: 'dummyAddress',
      paraTime: ParaTime.Cipher,
      privateKey: 'privateKey',
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

  it('should set input value to max', () => {
    const setTransactionForm = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({ ...mockUseParaTimesResult, setTransactionForm })
    const { rerender } = render(<TransactionAmount />)

    userEvent.click(screen.getByRole('button', { name: 'MAX' }))
    expect(setTransactionForm).toHaveBeenNthCalledWith(1, expect.objectContaining({ amount: '1' }))

    jest
      .mocked(useParaTimes)
      .mockReturnValue({ ...mockUseParaTimesResult, setTransactionForm, balance: '2493300888889' })
    rerender(<TransactionAmount />)

    userEvent.click(screen.getByRole('button', { name: 'MAX' }))
    expect(setTransactionForm).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ amount: '2,493.300888889' }),
    )
  })

  it('should require amount field on form submit', () => {
    const navigateToConfirmation = jest.fn()
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToConfirmation,
    })
    render(<TransactionAmount />)

    userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Field is required')).toBeInTheDocument()
    expect(navigateToConfirmation).not.toHaveBeenCalled()
  })

  it('should validate amount field on form submit', () => {
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

    userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Insufficient balance')).toBeInTheDocument()
    expect(navigateToConfirmation).not.toHaveBeenCalled()
  })

  it('should navigate to confirmation step when amount is valid', () => {
    const navigateToConfirmation = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      transactionForm: {
        amount: '1',
      },
    } as ParaTimesHook)
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToConfirmation,
    })
    render(<TransactionAmount />)

    userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(navigateToConfirmation).toHaveBeenCalled()
  })

  it('should fetch non EVMc paraTime balance', () => {
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      isDepositing: false,
    } as ParaTimesHook)
    render(<TransactionAmount />)

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        address: 'dummyAddress',
        paraTime: 'cipher',
      },
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
      payload: {
        paraTime: 'emerald',
        privateKey: 'privateKey',
      },
      type: paraTimesActions.fetchBalanceUsingEthPrivateKey.type,
    })
  })
})
