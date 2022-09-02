import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransactionForm, TransactionTypes } from 'app/state/paratimes/types'
import { useParaTimes, ParaTimesHook } from '../../useParaTimes'
import { useParaTimesNavigation, ParaTimesNavigationHook } from '../../useParaTimesNavigation'
import { TransactionConfirmation } from '..'

jest.unmock('react-i18next')
jest.mock('../../useParaTimes')
jest.mock('../../useParaTimesNavigation')

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
  } as ParaTimesHook
  const mockUseParaTimesNavigationResult = {} as ParaTimesNavigationHook

  beforeEach(() => {
    jest.mocked(useParaTimes).mockReturnValue(mockUseParaTimesResult)
    jest.mocked(useParaTimesNavigation).mockReturnValue(mockUseParaTimesNavigationResult)
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

  it('should require a confirmation on form submit', () => {
    const navigateToSummary = jest.fn()
    jest
      .mocked(useParaTimesNavigation)
      .mockReturnValue({ ...mockUseParaTimesNavigationResult, navigateToSummary })
    render(<TransactionConfirmation />)

    userEvent.click(screen.getByRole('button', { name: 'Deposit' }))

    expect(screen.getByText('Field is required')).toBeInTheDocument()
    expect(navigateToSummary).not.toHaveBeenCalled()
  })

  it('should allow to navigate to summary section', () => {
    const navigateToSummary = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      transactionForm: {
        amount: '10',
        confirmation: true,
        recipient: 'dummyAddress',
        type: TransactionTypes.Withdraw,
      } as TransactionForm,
    })
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToSummary,
    })
    render(<TransactionConfirmation />)

    userEvent.click(screen.getByRole('button', { name: 'Deposit' }))

    expect(navigateToSummary).toHaveBeenCalled()
  })

  it('should navigate back to amount selection step', () => {
    const navigateToAmount = jest.fn()
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToAmount,
    })
    render(<TransactionConfirmation />)

    userEvent.click(screen.getByRole('button', { name: 'Previous' }))

    expect(navigateToAmount).toHaveBeenCalled()
  })
})
