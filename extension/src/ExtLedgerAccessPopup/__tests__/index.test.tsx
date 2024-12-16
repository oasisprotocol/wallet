import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { requestDevice } from 'app/lib/ledger'
import { ExtLedgerAccessPopup } from '../ExtLedgerAccessPopup'

jest.mock('app/lib/ledger')

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}))

describe('<ExtLedgerAccessPopup />', () => {
  it('should render component', () => {
    const { container } = render(<ExtLedgerAccessPopup />)

    expect(container).toMatchSnapshot()
  })

  it('should render success state', async () => {
    jest.mocked(requestDevice).mockResolvedValue({} as USBDevice)

    render(<ExtLedgerAccessPopup />)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('ledger.extension.succeed')).toBeInTheDocument()
    expect(screen.getByLabelText('Status is okay')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render error state', async () => {
    jest.mocked(requestDevice).mockRejectedValue(new Error('error'))

    render(<ExtLedgerAccessPopup />)

    userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('ledger.extension.failed')).toBeInTheDocument()
    expect(screen.getByLabelText('Status is critical')).toBeInTheDocument()
    expect(mockDispatch).not.toHaveBeenCalled()
  })
})
