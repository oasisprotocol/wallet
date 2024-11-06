import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { requestDevice } from 'app/lib/ledger'
import { ExtensionRequestLedgerPermissionPopup } from '../ExtensionRequestLedgerPermissionPopup'

jest.mock('app/lib/ledger')

describe('<ExtensionRequestLedgerPermissionPopup />', () => {
  it('should render component', () => {
    const { container } = render(<ExtensionRequestLedgerPermissionPopup />)

    expect(container).toMatchSnapshot()
  })

  it('should render success state', async () => {
    jest.mocked(requestDevice).mockResolvedValue({} as USBDevice)

    render(<ExtensionRequestLedgerPermissionPopup />)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('ledger.extension.succeed')).toBeInTheDocument()
    expect(screen.getByLabelText('Status is okay')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render error state', async () => {
    jest.mocked(requestDevice).mockRejectedValue(new Error('error'))

    render(<ExtensionRequestLedgerPermissionPopup />)

    userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('ledger.extension.failed')).toBeInTheDocument()
    expect(screen.getByLabelText('Status is critical')).toBeInTheDocument()
  })
})
