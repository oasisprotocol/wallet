import { NodeInternal } from '@oasisprotocol/client/dist/client'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { stakingActions } from 'app/state/staking'
import { Validator } from 'app/state/staking/types'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { ValidatorList } from '..'

jest.mock('@oasisprotocol/client/dist/client')

const activeValidator: Validator = {
  address: 'oasis1qpc4ze5zzq3aa5mu5ttu4ku4ctp5t6x0asemymfz',
  nodeAddress: 'oasis1qpwrtzadlddfuvdhjlta85268ju7dj0flsrfgg5x',
  current_rate: 0.1,
  rank: 0,
  status: 'active',
  escrow: 1000,
  name: 'test-validator1',
  media: {
    email_address: 'test@test.com',
    tg_chat: 'telegram',
    twitter_acc: 'https://twitter.com/my_twitter',
    website_link: 'https://test.com',
  },
}
const inactiveValidator: Validator = {
  address: 'oasis1qzyqaxestzlum26e2vdgvkerm6d9qgdp7gh2pxqe',
  nodeAddress: 'oasis1qrdlqcv3tnv7qzuucnq0fncua52n66x7n5pm3n93',
  current_rate: 0.2,
  rank: 1,
  status: 'inactive',
  escrow: 1000,
  name: 'test-validator2',
  media: activeValidator.media,
}
const unknownValidator: Validator = {
  address: 'oasis1qrfe9n26nq3t6vc9hlu9gnupwf4rm6wr0uglh3r7',
  nodeAddress: 'oasis1qq672rjh7mldhaj35mlf4w34m8jtl9vu2c8qspkz',
  current_rate: 0.2,
  rank: 2,
  status: 'unknown',
  escrow: 1000,
  name: 'test-validator3',
  media: activeValidator.media,
}

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <ValidatorList />
    </Provider>,
  )

describe('<ValidatorList  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()

    jest.mocked(NodeInternal).mockReturnValue({
      async stakingAccount(query: any) {
        return {
          escrow: {
            commission_schedule: {
              bounds: [{ start: 0, rate_max: new Uint8Array([5]) }],
            },
          },
        }
      },
    } as NodeInternal)
  })

  it('empty should match snapshot', () => {
    const component = renderComponent(store)
    store.dispatch(
      stakingActions.updateValidators({
        timestamp: new Date('2022').getTime(),
        network: 'mainnet',
        list: [],
      }),
    )
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('list should match snapshot', () => {
    const component = renderComponent(store)
    store.dispatch(
      stakingActions.updateValidators({
        timestamp: new Date('2022').getTime(),
        network: 'mainnet',
        list: [activeValidator, inactiveValidator, unknownValidator],
      }),
    )
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should display validator details on click', async () => {
    renderComponent(store)
    store.dispatch(
      stakingActions.updateValidators({
        timestamp: new Date('2022').getTime(),
        network: 'mainnet',
        list: [activeValidator],
      }),
    )

    let row = screen.getByText(/test-validator/)
    expect(row).toBeVisible()
    userEvent.click(row)

    const details = await screen.findByTestId('validator-item')
    row = screen.getAllByText(/test-validator/)[0]

    expect(details).toBeVisible()
    userEvent.click(row)
    await waitFor(() => expect(details).not.toBeVisible())
  })

  it('should only display the details of a single validator', async () => {
    renderComponent(store)
    store.dispatch(
      stakingActions.updateValidators({
        timestamp: new Date('2022').getTime(),
        network: 'mainnet',
        list: [activeValidator, inactiveValidator],
      }),
    )

    let row = screen.getByText(/test-validator1/)
    expect(row).toBeVisible()
    userEvent.click(row)

    let details = await screen.findByTestId('validator-item')
    expect(screen.getByTestId('validator-item-name').textContent).toEqual('test-validator1')
    expect(details).toBeVisible()

    row = screen.getByText(/test-validator2/)
    userEvent.click(row)

    details = screen.getByTestId('validator-item')
    expect(await screen.findByTestId('validator-item-name')).toHaveTextContent('test-validator2')
    expect(details).toBeVisible()
  })
})
