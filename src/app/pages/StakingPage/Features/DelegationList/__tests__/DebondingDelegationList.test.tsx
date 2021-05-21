import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import { render } from '@testing-library/react'

import { Provider } from 'react-redux'
import { DebondingDelegationList } from '../DebondingDelegationList'
import { configureAppStore } from 'store/configureStore'
import { stakingActions } from 'app/state/staking'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

const renderComponent = store =>
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
    store.dispatch(
      stakingActions.updateDebondingDelegations([
        {
          epoch: 100,
          amount: '100',
          shares: '100',
          validatorAddress: 'test-validator',
          validator: {
            fee: 0.1,
            address: 'test-validator',
            rank: 1,
            status: 'active',
            name: 'test-validator',
          },
        },
      ]),
    )

    expect(component).toMatchSnapshot()
  })

  it('should expand and display the delegation on click', async () => {
    renderComponent(store)
    store.dispatch(
      stakingActions.updateDebondingDelegations([
        {
          epoch: 100,
          amount: '100',
          shares: '100',
          validatorAddress: 'test-validator1',
          validator: {
            address: 'test-validator1',
            fee: 0,
            rank: 1,
            status: 'active',
            name: 'test-validator1',
          },
        },
        { amount: '50', shares: '50', validatorAddress: 'test-validator2', epoch: 100 },
      ]),
    )

    let row = screen.getByText(/test-validator1/)
    expect(row).toBeVisible()
    userEvent.click(row)

    const details = screen.getByTestId('validator-item')
    row = screen.getAllByText(/test-validator1/)[0]

    expect(details).toBeVisible()
    userEvent.click(row)
    await waitFor(() => expect(details).not.toBeVisible())
  })
})
