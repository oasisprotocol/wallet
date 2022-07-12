import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'

import { Provider } from 'react-redux'
import { ActiveDelegationList } from '../ActiveDelegationList'
import { configureAppStore } from 'store/configureStore'
import { stakingActions } from 'app/state/staking'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <ActiveDelegationList />
    </Provider>,
  )

describe('<ActiveDelegationList  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    store.dispatch(
      stakingActions.updateDelegations({
        delegations: [
          {
            amount: '100',
            shares: '100',
            validatorAddress: 'test-validator',
            validator: {
              current_rate: 0.07,
              address: 'test-validator',
              rank: 1,
              status: 'active',
              name: 'test-validator',
              nodeAddress: 'oasis1qq7pgk9v8l3hu2aenjtflezy5vajc2cz3y4d96rj',
            },
          },
        ],
        debondingDelegations: [],
      }),
    )

    expect(component.baseElement).toMatchSnapshot()

    // @TODO expect no rounding issues
    expect(screen.queryByText('7.000000000000001%')).toBeTruthy()
    expect(screen.queryByText('7%')).toBeFalsy()
  })

  it('should expand and display the delegation on click', async () => {
    renderComponent(store)
    store.dispatch(
      stakingActions.updateDelegations({
        delegations: [
          {
            amount: '100',
            shares: '100',
            validatorAddress: 'oasis1qqv25adrld8jjquzxzg769689lgf9jxvwgjs8tha',
            validator: {
              address: 'oasis1qqv25adrld8jjquzxzg769689lgf9jxvwgjs8tha',
              rank: 1,
              status: 'active',
              name: 'test-validator1',
              nodeAddress: 'oasis1qq7pgk9v8l3hu2aenjtflezy5vajc2cz3y4d96rj',
            },
          },
          { amount: '50', shares: '50', validatorAddress: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4' },
        ],
        debondingDelegations: [],
      }),
    )

    let row = screen.getByText(/test-validator1/)
    expect(row).toBeVisible()
    userEvent.click(row)

    const details = await screen.findByTestId('validator-item')
    row = screen.getAllByText(/test-validator1/)[0]

    expect(details).toBeVisible()
    userEvent.click(row)
    await waitFor(() => expect(details).not.toBeVisible())
  })
})
