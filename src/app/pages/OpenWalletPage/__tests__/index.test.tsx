import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { when } from 'jest-when'
import { selectShowAccountsSelectionModal } from 'app/state/importaccounts/selectors'
import { SelectOpenMethod } from '..'

jest.mock('app/lib/ledger', () => ({
  ...jest.requireActual('app/lib/ledger'),
  canAccessBle: jest.fn().mockResolvedValue(false),
  canAccessNavigatorUsb: jest.fn().mockResolvedValue(false),
}))
jest.mock('config', () => ({
  ...jest.requireActual('config'),
  runtimeIs: 'extension',
}))
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}))
jest.mock('app/lib/ledger')

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const renderComponent = () =>
  render(
    <MemoryRouter>
      <SelectOpenMethod />
    </MemoryRouter>,
  )

describe('<SelectOpenMethod />', () => {
  it('should render component', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('should redirect user to ledger page', async () => {
    when(useSelector as any)
      .calledWith(selectShowAccountsSelectionModal)
      .mockReturnValue(true)

    renderComponent()

    await waitFor(() => {
      expect(screen.queryByText('openWallet.method.ledger')).toBeInTheDocument()

      expect(mockNavigate).toHaveBeenCalledWith('/open-wallet/ledger/usb')
    })
  })
})
