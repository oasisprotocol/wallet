import * as oasis from '@oasisprotocol/client'
import { screen, waitFor } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { NetworkSelector } from '..'

jest.mock('@oasisprotocol/client')

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <NetworkSelector />
    </Provider>,
  )

describe('<NetworkSelector  />', () => {
  let store: ReturnType<typeof configureAppStore>
  let NodeInternalPrototype = jest.mocked(oasis.client.NodeInternal.prototype)

  beforeEach(() => {
    store = configureAppStore()
    jest.mocked(oasis.quantity.toBigInt).mockReturnValue(0n)
    NodeInternalPrototype.beaconGetEpoch.mockResolvedValue(1)
    NodeInternalPrototype.stakingTokenSymbol.mockResolvedValue('')
    NodeInternalPrototype.stakingConsensusParameters.mockResolvedValue({} as any)
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should allow switching network', async () => {
    const component = renderComponent(store)
    expect(component.queryByTestId('active-network')).toContainHTML('toolbar.networks.local')
    userEvent.click(screen.getByTestId('network-selector'))

    await waitFor(() => expect(screen.getByText('toolbar.networks.testnet')))
    screen.getByText('toolbar.networks.testnet').click()
    await waitFor(() =>
      expect(component.queryByTestId('active-network')).toContainHTML('toolbar.networks.testnet'),
    )
  })
})
