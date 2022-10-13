import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransactionForm } from 'app/state/paratimes/types'
import { useParaTimes, ParaTimesHook } from '../../useParaTimes'
import { useParaTimesNavigation, ParaTimesNavigationHook } from '../../useParaTimesNavigation'
import { ParaTime } from '../../../../../config'
import { ParaTimeSelection } from '..'

jest.mock('../../useParaTimes')
jest.mock('../../useParaTimesNavigation')

describe('<ParaTimeSelection />', () => {
  const mockUseParaTimesResult = {
    availableParaTimesForSelectedNetwork: [
      {
        isEvm: false,
        value: ParaTime.Cipher,
      },
      {
        isEvm: true,
        value: ParaTime.Emerald,
      },
    ],
    isDepositing: true,
    ticker: 'ROSE',
    transactionForm: {
      paraTime: ParaTime.Cipher,
    },
  } as ParaTimesHook
  const mockUseParaTimesNavigationResult = {} as ParaTimesNavigationHook

  beforeEach(() => {
    jest.mocked(useParaTimes).mockReturnValue(mockUseParaTimesResult)
    jest.mocked(useParaTimesNavigation).mockReturnValue(mockUseParaTimesNavigationResult)
  })

  it('should render component', () => {
    const { container } = render(<ParaTimeSelection />)

    expect(container).toMatchSnapshot()
  })

  it('should require a selection on form submit', async () => {
    const navigateToRecipient = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      transactionForm: {
        paraTime: undefined,
      } as TransactionForm,
    })
    render(<ParaTimeSelection />)

    await userEvent.click(screen.getByRole('button', { name: 'paraTimes.footer.next' }))

    expect(screen.getByText('paraTimes.validation.required')).toBeInTheDocument()
    expect(navigateToRecipient).not.toHaveBeenCalled()
  })

  it('should navigate to recipient', async () => {
    const navigateToRecipient = jest.fn()
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      navigateToRecipient,
    })
    render(<ParaTimeSelection />)

    await userEvent.click(screen.getByRole('button', { name: 'paraTimes.footer.next' }))

    expect(navigateToRecipient).toHaveBeenCalled()
  })

  it('should cancel transfer', async () => {
    const clearTransactionForm = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      clearTransactionForm,
    })
    render(<ParaTimeSelection />)

    await userEvent.click(screen.getByRole('button', { name: 'paraTimes.selection.cancel' }))

    expect(clearTransactionForm).toHaveBeenCalled()
  })
})
