import * as React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { NetworkState } from 'app/state/network/types'

import { AmountFormatter, AmountFormatterProps } from '..'

const renderComponent = (store: any, { amount, smallTicker }: AmountFormatterProps) =>
  render(
    <Provider store={store}>
      <AmountFormatter amount={amount} smallTicker={smallTicker} />
    </Provider>,
  )

describe('<AmountFormatter />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({
      network: {
        ticker: 'ROSE',
      } as NetworkState,
    })
  })

  it('should render component', () => {
    const { container } = renderComponent(store, { amount: 456542341274, smallTicker: false })

    expect(container).toMatchSnapshot()
  })

  it('should render component with small ticker', () => {
    const { container } = renderComponent(store, { amount: 456542341274, smallTicker: true })

    expect(container).toMatchSnapshot()
  })
})
