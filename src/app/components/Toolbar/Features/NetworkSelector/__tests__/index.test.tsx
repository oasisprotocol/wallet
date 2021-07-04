import * as oasis from '@oasisprotocol/client'
import { screen, waitFor } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { NetworkSelector } from '..'

jest.mock('@oasisprotocol/client')

const renderComponent = store =>
  render(
    <Provider store={store}>
      <NetworkSelector />
    </Provider>,
  )

describe('<NetworkSelector  />', () => {
  let store: ReturnType<typeof configureAppStore>
  let NodeInternal = oasis.client.NodeInternal as jest.Mock<oasis.client.NodeInternal>

  beforeEach(() => {
    store = configureAppStore()
    ;(oasis.quantity.toBigInt as jest.Mock).mockReturnValue(0n)
    NodeInternal.prototype.beaconGetEpoch.mockResolvedValue(1)
    NodeInternal.prototype.consensusGetGenesisDocument.mockResolvedValue({
      staking: { token_symbol: '', params: { min_delegation: new Uint8Array([0]) } },
      beacon: { params: { insecure_parameters: { interval: 30 } } },
    } as any)
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should allow switching network', async () => {
    const component = renderComponent(store)
    expect(component.queryByTestId('active-network')).toContainHTML('Local')
    userEvent.click(screen.getByTestId('network-selector'))

    await waitFor(() => expect(screen.getByText('Testnet')))
    screen.getByText('Testnet').click()
    await waitFor(() => expect(component.queryByTestId('active-network')).toContainHTML('Testnet'))
  })
})
