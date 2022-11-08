import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SelectOpenMethod } from '..'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
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
})
