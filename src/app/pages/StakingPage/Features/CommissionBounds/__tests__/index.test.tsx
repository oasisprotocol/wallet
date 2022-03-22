import { render } from '@testing-library/react'
import { networkActions } from 'app/state/network'
import { NetworkState } from 'app/state/network/types'
import { CommissionBound as ICommissionBounds } from 'app/state/staking/types'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { CommissionBounds } from '..'

const renderComponent = (store: any, bounds?: ICommissionBounds[]) =>
  render(
    <Provider store={store}>
      <CommissionBounds bounds={bounds} />
    </Provider>,
  )

describe('<CommissionBounds  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot when empty', () => {
    const component = renderComponent(store)
    expect(component).toMatchSnapshot()
  })

  it('should match snapshot with provided bounds', () => {
    const component = renderComponent(store, [{ epochStart: 0, lower: 0.1, upper: 0.2, epochEnd: 100 }])
    expect(component).toMatchSnapshot()
  })

  it('should match snapshot with active bounds', () => {
    store = configureAppStore()
    const component = renderComponent(store, [{ epochStart: 0, lower: 0.1, upper: 0.2, epochEnd: 100 }])
    store.dispatch(networkActions.networkSelected({ epoch: 50 } as NetworkState))
    expect(component).toMatchSnapshot()
  })
})
