import { render, screen } from '@testing-library/react'
import { FromBleLedger } from '..'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

describe('<FromBleLedger />', () => {
  it('should render component', () => {
    render(<FromBleLedger />)

    expect(screen.queryByText('ledger.instructionSteps.connectBluetoothLedger')).toBeInTheDocument()
    expect(screen.queryByText('ledger.instructionSteps.deviceIsPaired')).toBeInTheDocument()
    expect(screen.queryByText('ledger.instructionSteps.closeLedgerLive')).toBeInTheDocument()
    expect(screen.queryByText('ledger.instructionSteps.openOasisApp')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'openWallet.importAccounts.selectDevice' })).toBeInTheDocument()
  })
})
