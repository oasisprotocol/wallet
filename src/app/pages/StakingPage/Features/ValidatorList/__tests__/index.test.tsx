import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initialState, stakingActions } from 'app/state/staking'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { ValidatorList } from '..'

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
      <ValidatorList />
    </Provider>,
  )

describe('<ValidatorList  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({ staking: initialState })
  })

  it('should match snapshot', () => {
    store.dispatch(stakingActions.updateValidators([]))
    const component = renderComponent(store)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should display validator details on click', async () => {
    store = configureAppStore({
      staking: {
        ...initialState,
        validators: [
          {
            address: 'oasis123456789',
            fee: 10,
            rank: 0,
            status: 'active',
            escrow: 1000,
            name: 'test-validator',
            media: {
              email_address: 'test@test.com',
              tg_chat: 'telegram',
              twitter_acc: 'https://twitter.com/my_twitter',
              website_link: 'https://test.com',
            },
          },
        ],
      },
    })

    renderComponent(store)

    let row = screen.getByText(/test-validator/)
    expect(row).toBeVisible()
    userEvent.click(row)

    const details = screen.getByTestId('validator-item')
    row = screen.getAllByText(/test-validator/)[0]

    expect(details).toBeVisible()
    userEvent.click(row)
    await waitFor(() => expect(details).not.toBeVisible())
  })

  it('should only display the details of a single validator', async () => {
    store = configureAppStore({
      staking: {
        ...initialState,
        validators: [
          {
            address: 'oasis1validator1',
            fee: 10,
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
          },
          {
            address: 'oasis1validator2',
            fee: 10,
            rank: 1,
            status: 'inactive',
            escrow: 1000,
            name: 'test-validator2',
            media: {
              email_address: 'test@test.com',
              tg_chat: 'telegram',
              twitter_acc: 'https://twitter.com/my_twitter',
              website_link: 'https://test.com',
            },
          },
        ],
      },
    })

    renderComponent(store)

    let row = screen.getByText(/test-validator1/)
    expect(row).toBeVisible()
    userEvent.click(row)

    let details = screen.getByTestId('validator-item')
    expect(screen.getByTestId('validator-item-name').textContent).toEqual('test-validator1')
    expect(details).toBeVisible()

    row = screen.getByText(/test-validator2/)
    userEvent.click(row)

    details = screen.getByTestId('validator-item')
    expect(screen.getByTestId('validator-item-name').textContent).toEqual('test-validator2')
    expect(details).toBeVisible()
  })
})
