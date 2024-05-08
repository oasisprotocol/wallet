import { render, screen, waitFor } from '@testing-library/react'
import { FromLedger } from '..'
import { MemoryRouter } from 'react-router-dom'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

jest.mock('../../../../../lib/ledger', () => ({
  ...jest.requireActual('../../../../../lib/ledger'),
  // Throws BLE not supported
  canAccessBle: jest.fn().mockResolvedValue(false),
}))

const renderComponent = () =>
  render(
    <MemoryRouter>
      <FromLedger />
    </MemoryRouter>,
  )

describe('<FromLedger />', () => {
  it('should render component in disabled state', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByText('openWallet.importAccounts.usbLedger')).toBeInTheDocument()
      expect(screen.queryByText('openWallet.importAccounts.bluetoothLedger')).toBeInTheDocument()

      expect(screen.getByText('errors.usbTransportNotSupported')).toBeInTheDocument()
      expect(screen.getByText('errors.bluetoothTransportNotSupported')).toBeInTheDocument()

      const usbLedgerBtn = screen.getByRole('button', { name: 'openWallet.importAccounts.usbLedger' })
      const bluetoothLedgerBtn = screen.getByRole('button', {
        name: 'openWallet.importAccounts.bluetoothLedger',
      })

      expect(usbLedgerBtn).toHaveProperty('disabled', true)
      expect(bluetoothLedgerBtn).toHaveProperty('disabled', true)
    })
  })
})
