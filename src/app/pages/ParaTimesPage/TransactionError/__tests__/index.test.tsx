import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WalletErrors } from 'types/errors'
import { useParaTimes, ParaTimesHook } from '../../useParaTimes'
import { useParaTimesNavigation, ParaTimesNavigationHook } from '../../useParaTimesNavigation'
import { TransactionError } from '..'

jest.unmock('react-i18next')
jest.mock('../../useParaTimes')
jest.mock('../../useParaTimesNavigation')

describe('<TransactionError />', () => {
  const mockUseParaTimesResult = {
    isDepositing: true,
    isEvmcParaTime: false,
    paraTimeName: 'Cipher',
    ticker: 'ROSE',
    transactionError: {
      code: WalletErrors.ParaTimesUnknownError,
      message: 'error message',
    },
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
  })

  it('should render component', () => {
    const { container } = render(<TransactionError />)

    expect(container).toMatchSnapshot()
  })

  it('should render EVMc withdraw variant component', () => {
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      isDepositing: false,
      isEvmcParaTime: true,
      paraTimeName: 'Emerald',
    } as ParaTimesHook)
    render(<TransactionError />)

    expect(screen.getByTestId('paraTime-content-description')).toMatchSnapshot()
  })

  it('should reset transaction form', async () => {
    const resetTransactionForm = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      resetTransactionForm,
    })
    render(<TransactionError />)

    await userEvent.click(screen.getByRole('button', { name: 'Navigate to ParaTimes Transfers' }))

    expect(resetTransactionForm).toHaveBeenCalled()
  })

  it('should navigate back to confirmation step', async () => {
    const navigateToConfirmation = jest.fn()
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToConfirmation,
    })
    render(<TransactionError />)

    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))

    expect(navigateToConfirmation).toHaveBeenCalled()
  })
})
