import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransactionTypes } from 'app/state/paratimes/types'
import { useParaTimes, ParaTimesHook } from '../../useParaTimes'
import { ParaTime } from '../../../../../config'
import { TransactionSummary } from '..'

jest.mock('../../useParaTimes')
jest.unmock('react-i18next')

describe('<TransactionSummary />', () => {
  const mockUseParaTimesResult = {
    isDepositing: true,
    isEvmcParaTime: false,
    paraTimeName: 'Cipher',
    ticker: 'ROSE',
    transactionForm: {
      amount: '10',
      paraTime: ParaTime.Cipher,
      recipient: 'dummyAddress',
      type: TransactionTypes.Withdraw,
    },
  } as ParaTimesHook

  it('should render component', () => {
    jest.mocked(useParaTimes).mockReturnValue(mockUseParaTimesResult)
    const { container } = render(<TransactionSummary />)

    expect(container).toMatchSnapshot()
  })

  it('should call clearTransactionForm', async () => {
    const clearTransactionForm = jest.fn()

    jest.mocked(useParaTimes).mockReturnValue({
      ...mockUseParaTimesResult,
      clearTransactionForm,
    })
    render(<TransactionSummary />)

    await userEvent.click(screen.getByRole('button'))

    expect(clearTransactionForm).toHaveBeenCalled()
  })

  it('should render EVMc withdraw variant component', () => {
    jest.mocked(useParaTimes).mockReturnValue({
      isDepositing: false,
      isEvmcParaTime: true,
      paraTimeName: 'Emerald',
      ticker: 'ROSE',
      transactionForm: {
        amount: '10',
        paraTime: ParaTime.Emerald,
        recipient: 'dummyAddress',
        type: TransactionTypes.Withdraw,
      },
    } as ParaTimesHook)
    render(<TransactionSummary />)

    expect(screen.getByTestId('paraTime-content-description')).toMatchSnapshot()
  })
})
