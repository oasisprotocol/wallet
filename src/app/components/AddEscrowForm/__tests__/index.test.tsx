import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { AddEscrowForm } from '..'

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

const renderComponent = (store, address) =>
  render(
    <Provider store={store}>
      <AddEscrowForm validatorAddress={address} />
    </Provider>,
  )

describe('<AddEscrowForm />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store, 'dummy-address')
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should dispatch an addEscrow transaction', () => {
    const component = renderComponent(store, 'dummy-address')

    //@TODO: Spinbutton ? Really testing-library ? Add a testid and open an issue
    userEvent.type(screen.getByRole('spinbutton'), '1000')
    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('errors.noOpenWallet')).toBeInTheDocument()
  })
})
