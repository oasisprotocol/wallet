import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { when } from 'jest-when'
import userEvent from '@testing-library/user-event'
import { TransactionForm, TransactionTypes } from 'app/state/paratimes/types'
import { selectValidators } from 'app/state/staking/selectors'
import { selectWalletsAddresses } from 'app/state/wallet/selectors'
import { useParaTimes, ParaTimesHook } from '../../useParaTimes'
import { useParaTimesNavigation, ParaTimesNavigationHook } from '../../useParaTimesNavigation'
import { TransactionConfirmation } from '..'

jest.unmock('react-i18next')
jest.mock('../../useParaTimes')
jest.mock('../../useParaTimesNavigation')
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}))

describe('<TransactionConfirmation />', () => {
  const mockUseParaTimesResult = {
    isDepositing: true,
    isEvmcParaTime: false,
    paraTimeName: 'Cipher',
    ticker: 'ROSE',
    transactionForm: {
      amount: '10',
      recipient: 'dummyAddress',
    },
    usesOasisAddress: true,
  } as ParaTimesHook
  const mockUseParaTimesNavigationResult = {} as ParaTimesNavigationHook

  beforeEach(() => {
    jest.mocked(useParaTimes).mockReturnValue(mockUseParaTimesResult)
    jest.mocked(useParaTimesNavigation).mockReturnValue(mockUseParaTimesNavigationResult)
    when(useSelector as any)
      .calledWith(selectValidators)
      .mockReturnValue([])
      .calledWith(selectWalletsAddresses)
      .mockReturnValue(['dummyAddress'])
  })

  it('should render component', () => {
    const { container } = render(<TransactionConfirmation />)

    expect(container).toMatchSnapshot()
  })

  it('should render EVMc withdraw variant component', () => {
    jest.mocked(useParaTimes).mockReturnValue({
      isDepositing: false,
      isEvmcParaTime: true,
      paraTimeName: 'Emerald',
      ticker: 'ROSE',
      transactionForm: {
        amount: '10',
        recipient: 'dummyAddress',
        type: TransactionTypes.Withdraw,
      },
    } as ParaTimesHook)
    render(<TransactionConfirmation />)

    expect(screen.getByTestId('paraTime-content-description')).toMatchSnapshot()
  })

  it('should require a confirmation on form submit', async () => {
    const navigateToSummary = jest.fn()
    jest
      .mocked(useParaTimesNavigation)
      .mockReturnValue({ ...mockUseParaTimesNavigationResult, navigateToSummary })
    render(<TransactionConfirmation />)

    await userEvent.click(screen.getByRole('button', { name: 'Deposit' }))

    expect(screen.getByText('Field is required')).toBeInTheDocument()
    expect(navigateToSummary).not.toHaveBeenCalled()
  })

  it('should render additional confirmation checkbox when transferring tokens to validator', async () => {
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      transactionForm: {
        ...mockUseParaTimesResult.transactionForm,
        recipient: 'validatorAddress',
      },
    } as ParaTimesHook)
    when(useSelector as any)
      .calledWith(selectValidators)
      .mockReturnValue([{ address: 'validatorAddress' }])
    render(<TransactionConfirmation />)

    expect(screen.getByText('I confirm I want to transfer ROSE to a validator address')).toBeInTheDocument()
  })

  it('should render additional confirmation checkbox when transferring tokens to foreign account', async () => {
    when(useSelector as any)
      .calledWith(selectWalletsAddresses)
      .mockReturnValue(['addressInAccount'])
    render(<TransactionConfirmation />)

    expect(
      screen.getByText('I confirm I want to directly withdraw to an external account'),
    ).toBeInTheDocument()
  })

  it('should submit transaction', async () => {
    const submitTransaction = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      transactionForm: {
        amount: '10',
        confirmTransfer: true,
        recipient: 'dummyAddress',
        type: TransactionTypes.Withdraw,
      } as TransactionForm,
      submitTransaction,
    })
    render(<TransactionConfirmation />)

    await userEvent.click(screen.getByRole('button', { name: 'Deposit' }))

    expect(submitTransaction).toHaveBeenCalled()
  })

  it('should navigate back to amount selection step', async () => {
    const navigateToAmount = jest.fn()
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToAmount,
    })
    render(<TransactionConfirmation />)

    await userEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(navigateToAmount).toHaveBeenCalled()
  })
})
