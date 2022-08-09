import * as React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { NetworkState } from 'app/state/network/types'

import { TimeToEpoch } from '..'

const renderComponent = (store: any, epoch: number) =>
  render(
    <Provider store={store}>
      <TimeToEpoch epoch={epoch} />
    </Provider>,
  )

describe('<TimeToEpoch />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({
      network: {
        epoch: 10000,
      } as NetworkState,
    })
  })

  it('should estimate debonding times', () => {
    expect(renderComponent(store, 10336).container.textContent).toEqual('in 14 days')
    expect(renderComponent(store, 10306).container.textContent).toEqual('in 13 days')
    expect(renderComponent(store, 10086).container.textContent).toEqual('in 4 days')
    expect(renderComponent(store, 10047).container.textContent).toEqual('in 47 hours')
    expect(renderComponent(store, 10001).container.textContent).toEqual('in 1 hour')
  })
})
