import { render } from '@testing-library/react'
import { selectTicker } from 'app/state/network/selectors'
import { when } from 'jest-when'
import * as React from 'react'
import { Provider, useSelector } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { OperationsRow } from 'vendors/explorer'

import { Transaction } from '..'

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

const renderComponent = (store, ref, transaction) =>
  render(
    <Provider store={store}>
      <Transaction referenceAddress={ref} transaction={transaction} />
    </Provider>,
  )

describe('<Transaction  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const ref = 'sourceAddr'
    const transaction: Partial<OperationsRow> = {
      amount: 1000000,
      timestamp: 1618018255,
      from: 'source',
      to: 'destination',
      type: 'transfer',
    }

    when(useSelector as any)
      .calledWith(selectTicker)
      .mockReturnValue('TEST')

    const component = renderComponent(store, ref, transaction)
    expect(component.container.firstChild).toMatchSnapshot()
  })
})
