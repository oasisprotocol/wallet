import userEvent from '@testing-library/user-event'
import { act, screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import { render } from '@testing-library/react'

import { Provider } from 'react-redux'
import { DebondingDelegationList } from '../DebondingDelegationList'
import { configureAppStore } from 'store/configureStore'
import { stakingActions } from 'app/state/staking'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <DebondingDelegationList />
    </Provider>,
  )

describe('<DebondingDelegationList  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    act(() => {
      store.dispatch(
        stakingActions.updateDelegations({
          delegations: [],
          debondingDelegations: [
            {
              epoch: 100,
              amount: 100n.toString(),
              shares: 100n.toString(),
              validatorAddress: 'test-validator',
              validator: {
                current_rate: 0.1,
                address: 'test-validator',
                rank: 1,
                status: 'active',
                name: 'test-validator',
                nodeAddress: 'oasis1qq7pgk9v8l3hu2aenjtflezy5vajc2cz3y4d96rj',
                escrow: 1000n.toString(),
              },
            },
          ],
        }),
      )
    })

    expect(component.baseElement).toMatchSnapshot()
  })

  it('should expand and display the delegation on click', async () => {
    renderComponent(store)
    act(() => {
      store.dispatch(
        stakingActions.updateDelegations({
          delegations: [],
          debondingDelegations: [
            {
              epoch: 100,
              amount: 100n.toString(),
              shares: 100n.toString(),
              validatorAddress: 'oasis1qqv25adrld8jjquzxzg769689lgf9jxvwgjs8tha',
              validator: {
                address: 'oasis1qqv25adrld8jjquzxzg769689lgf9jxvwgjs8tha',
                current_rate: 0,
                rank: 1,
                status: 'active',
                name: 'test-validator1',
                nodeAddress: 'oasis1qq7pgk9v8l3hu2aenjtflezy5vajc2cz3y4d96rj',
                escrow: 1000n.toString(),
              },
            },
            {
              amount: 50n.toString(),
              shares: 50n.toString(),
              validatorAddress: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
              epoch: 100,
            },
          ],
        }),
      )
    })

    let row = screen.getByText(/test-validator1/)
    expect(row).toBeVisible()
    await userEvent.click(row)

    const details = await screen.findByTestId('validator-item')
    row = screen.getAllByText(/test-validator1/)[0]

    expect(details).toBeVisible()
    await userEvent.click(row)
    await waitFor(() => expect(details).not.toBeVisible())
  })
})
