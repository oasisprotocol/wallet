import { screen, waitFor } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { NetworkSelector } from '..'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <NetworkSelector />
    </Provider>,
  )

describe('<NetworkSelector  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should allow switching network', async () => {
    const spy = jest.spyOn(store, 'dispatch')
    const component = renderComponent(store)
    expect(component.queryByTestId('active-network')).toContainHTML('Local')
    userEvent.click(screen.getByTestId('network-selector'))

    await waitFor(() => expect(screen.getByText('Testnet')))
    screen.getByText('Testnet').click()

    expect(spy).toHaveBeenCalledWith({
      payload: 'testnet',
      type: 'network/selectNetwork',
    })
  })
})
