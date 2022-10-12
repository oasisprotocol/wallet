import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { when } from 'jest-when'
import { selectShowAccountsSelectionModal } from 'app/state/importaccounts/selectors'
import { SelectOpenMethod } from '..'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const renderComponent = (webExtensionLedgerAccess?: () => void) =>
  render(
    <MemoryRouter>
      <SelectOpenMethod webExtensionLedgerAccess={webExtensionLedgerAccess} />
    </MemoryRouter>,
  )

describe('<SelectOpenMethod />', () => {
  it('should render component', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('should render component with an access button', () => {
    renderComponent(() => {})

    expect(screen.queryByText('openWallet.method.ledger')).not.toBeInTheDocument()
    expect(screen.getByText('ledger.extension.grantAccess')).toBeInTheDocument()
  })

  it('should redirect user to ledger page', () => {
    when(useSelector as any)
      .calledWith(selectShowAccountsSelectionModal)
      .mockReturnValue(true)

    renderComponent(() => {})

    expect(mockNavigate).toHaveBeenCalledWith('/open-wallet/ledger')
  })
})
