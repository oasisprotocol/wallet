import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { requestDevice } from 'app/lib/ledger'
import { importAccountsActions } from 'app/state/importaccounts'
import { ConnectDevicePage } from '..'
import { WalletType } from '../../../state/wallet/types'

jest.mock('app/lib/ledger')

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}))

describe('<ConnectDevicePage />', () => {
  it('should render component', () => {
    const { container } = render(<ConnectDevicePage />)

    expect(container).toMatchSnapshot()
  })

  it('should render success state', async () => {
    jest.mocked(requestDevice).mockResolvedValue({} as USBDevice)

    render(<ConnectDevicePage />)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('ledger.extension.succeed')).toBeInTheDocument()
    expect(screen.getByLabelText('Status is okay')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: WalletType.UsbLedger,
      type: importAccountsActions.enumerateAccountsFromLedger.type,
    })
  })

  it('should render error state', async () => {
    jest.mocked(requestDevice).mockRejectedValue(new Error('error'))

    render(<ConnectDevicePage />)

    userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('ledger.extension.failed')).toBeInTheDocument()
    expect(screen.getByLabelText('Status is critical')).toBeInTheDocument()
    expect(mockDispatch).not.toHaveBeenCalled()
  })
})
