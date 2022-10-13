import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransactionTypes } from 'app/state/paratimes/types'
import { useParaTimes, ParaTimesHook } from '../../useParaTimes'
import { useParaTimesNavigation, ParaTimesNavigationHook } from '../../useParaTimesNavigation'
import { TransactionRecipient } from '..'

jest.unmock('react-i18next')
jest.mock('../../useParaTimes')
jest.mock('../../useParaTimesNavigation')

describe('<TransactionRecipient />', () => {
  const mockUseParaTimesResult = {
    accountAddress: 'accountAddress',
    isDepositing: true,
    isEvmcParaTime: false,
    paraTimeName: 'Cipher',
    ticker: 'ROSE',
    transactionForm: {
      recipient: '',
      ethPrivateKey: '',
    },
    usesOasisAddress: true,
  } as ParaTimesHook
  const mockUseParaTimesNavigationResult = {} as ParaTimesNavigationHook

  beforeEach(() => {
    jest.mocked(useParaTimes).mockReturnValue(mockUseParaTimesResult)
    jest.mocked(useParaTimesNavigation).mockReturnValue(mockUseParaTimesNavigationResult)
  })

  it('should render component', () => {
    const { container } = render(<TransactionRecipient />)

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
    render(<TransactionRecipient />)

    expect(screen.getByTestId('paraTime-content-description')).toMatchSnapshot()
    expect(screen.getByPlaceholderText('Enter Ethereum-compatible private key')).toBeInTheDocument()
  })

  it('should require an address on form submit', async () => {
    const navigateToSummary = jest.fn()
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToSummary,
    })
    render(<TransactionRecipient />)

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Field is required')).toBeInTheDocument()
    expect(navigateToSummary).not.toHaveBeenCalled()
  })

  it('should validate an address on form submit', async () => {
    const navigateToSummary = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      transactionForm: {
        recipient: 'asd',
      },
    } as ParaTimesHook)
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToSummary,
    })
    render(<TransactionRecipient />)

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Invalid address')).toBeInTheDocument()
    expect(navigateToSummary).not.toHaveBeenCalled()
  })

  it('should navigate to amount selection step when address is valid', async () => {
    const navigateToAmount = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      transactionForm: {
        recipient: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
      },
    } as ParaTimesHook)
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToAmount,
    })
    render(<TransactionRecipient />)

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(navigateToAmount).toHaveBeenCalled()
  })

  it('should navigate back to deposit', async () => {
    const navigateToDeposit = jest.fn()
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToDeposit,
    })
    render(<TransactionRecipient />)

    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))

    expect(navigateToDeposit).toHaveBeenCalled()
  })

  it('should navigate back to withdraw', async () => {
    const navigateToWithdraw = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      isDepositing: false,
    } as ParaTimesHook)
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToWithdraw,
    })
    render(<TransactionRecipient />)

    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))

    expect(navigateToWithdraw).toHaveBeenCalled()
  })
})
