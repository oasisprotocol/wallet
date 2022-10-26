import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParaTimes, ParaTimesHook } from '../../useParaTimes'
import { useParaTimesNavigation, ParaTimesNavigationHook } from '../../useParaTimesNavigation'
import { ParaTimeTransferType } from '..'

jest.mock('../../useParaTimes')
jest.mock('../../useParaTimesNavigation')

describe('<ParaTimeTransferType />', () => {
  const mockUseParaTimesResult = {
    accountIsLoading: false,
    isWalletEmpty: false,
    ticker: 'ROSE',
  } as ParaTimesHook
  const mockUseParaTimesNavigationResult = {} as ParaTimesNavigationHook

  beforeEach(() => {
    jest.mocked(useParaTimes).mockReturnValue(mockUseParaTimesResult)
    jest.mocked(useParaTimesNavigation).mockReturnValue(mockUseParaTimesNavigationResult)
  })

  it('should render component', () => {
    const { container } = render(<ParaTimeTransferType />)

    expect(container).toMatchSnapshot()
  })

  it('should navigate to deposit', async () => {
    const navigateToDeposit = jest.fn()
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToDeposit,
    })
    render(<ParaTimeTransferType />)

    await userEvent.click(screen.getByRole('button', { name: 'paraTimes.transfers.deposit' }))

    expect(navigateToDeposit).toHaveBeenCalled()
  })

  it('should navigate to withdraw', async () => {
    const navigateToWithdraw = jest.fn()
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToWithdraw,
    })
    render(<ParaTimeTransferType />)

    await userEvent.click(screen.getByRole('button', { name: 'paraTimes.transfers.withdraw' }))

    expect(navigateToWithdraw).toHaveBeenCalled()
  })

  it('should render disabled state', () => {
    jest.mocked(useParaTimes).mockReturnValue({
      accountIsLoading: false,
      isWalletEmpty: true,
    } as ParaTimesHook)
    render(<ParaTimeTransferType />)

    expect(screen.getByText('paraTimes.transfers.depositDisabled')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'paraTimes.transfers.deposit' })).toBeDisabled()
  })
})
