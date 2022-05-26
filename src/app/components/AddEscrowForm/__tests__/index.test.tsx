import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModalProvider } from 'app/components/Modal'
import { Validator } from 'app/state/staking/types'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { AddEscrowForm } from '..'

const renderComponent = (store: any, address: string, validatorStatus: Validator['status']) =>
  render(
    <Provider store={store}>
      <ModalProvider>
        <AddEscrowForm validatorAddress={address} validatorStatus={validatorStatus} validatorRank={21} />
      </ModalProvider>
    </Provider>,
  )

describe('<AddEscrowForm />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store, 'dummy-address', 'active')
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should dispatch an addEscrow transaction', () => {
    renderComponent(store, 'dummy-address', 'active')

    userEvent.type(screen.getByTestId('amount'), '1000')
    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('errors.noOpenWallet')).toBeInTheDocument()
  })

  it('should warn before addEscrow to inactive validator', () => {
    renderComponent(store, 'dummy-address', 'inactive')

    userEvent.type(screen.getByTestId('amount'), '1000')
    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('account.addEscrow.confirmDelegatingToInactive.title')).toBeInTheDocument()
  })
})
