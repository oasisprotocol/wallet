import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { selectTicker } from 'app/state/network/selectors'
import { when } from 'jest-when'
import * as React from 'react'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import { Provider, useSelector } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { Transaction } from '..'
import * as transactionTypes from 'app/state/transaction/types'

jest.mock('react-i18next', () => ({
  Trans: ({ i18nKey }) => <>{i18nKey}</>,
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

const history = createMemoryHistory()
const pushSpy = jest.spyOn(history, 'push')
const renderComponent = (store, ref, transaction) =>
  render(
    <Router history={history}>
      <Provider store={store}>
        <Transaction referenceAddress={ref} transaction={transaction} />
      </Provider>
    </Router>,
  )

describe('<Transaction  />', () => {
  let store: ReturnType<typeof configureAppStore>
  const ref = 'sourceAddr'
  const transaction: Partial<transactionTypes.Transaction> = {
    amount: 1000000,
    timestamp: 1618018255,
    from: 'source',
    to: 'destination',
    type: transactionTypes.TransactionType.StakingTransfer,
    hash: 'ff1234',
  }

  beforeEach(() => {
    store = configureAppStore()

    when(useSelector as any)
      .calledWith(selectTicker)
      .mockReturnValue('TEST')
  })

  it('should match snapshot', () => {
    const component = renderComponent(store, ref, transaction)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should redirect user when clicking on address section', () => {
    renderComponent(store, ref, transaction)

    userEvent.click(screen.getByLabelText('ContactInfo'))
    expect(pushSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: `/account/${transaction.from}`,
      }),
    )
  })

  it('should not redirect user when clicking on amount or block section', () => {
    renderComponent(store, ref, transaction)

    userEvent.click(screen.getByLabelText('Money'))
    userEvent.click(screen.getByLabelText('Cube'))
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('should handle unknown transaction types gracefully', () => {
    const component = renderComponent(store, 'sourceAddr', {
      amount: 1000000,
      timestamp: 1618018255,
      from: 'source',
      to: 'destination',
      type: 'turboencabulate',
      hash: 'ff1234',
    })
    expect(component.container.firstChild).toMatchSnapshot()
  })
})
