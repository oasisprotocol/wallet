import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExtLedgerAccessPopup } from '../ExtLedgerAccessPopup'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

jest.mock('@ledgerhq/hw-transport')
jest.mock('@ledgerhq/hw-transport-webhid')

describe('<ExtLedgerAccessPopup />', () => {
  it('should render component', () => {
    const { container } = render(<ExtLedgerAccessPopup />)

    expect(container).toMatchSnapshot()
  })

  it('should render success state', async () => {
    jest.mocked(TransportWebHID.isSupported).mockResolvedValue(false)
    jest.mocked(TransportWebUSB.create).mockResolvedValue({} as TransportWebUSB)

    render(<ExtLedgerAccessPopup />)

    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('ledger.extension.succeed')).toBeInTheDocument()
    expect(screen.getByLabelText('Status is okay')).toBeInTheDocument()
  })

  it('should render error state', async () => {
    jest.mocked(TransportWebHID.isSupported).mockResolvedValue(false)
    jest.mocked(TransportWebUSB.create).mockRejectedValue(new Error('error'))

    render(<ExtLedgerAccessPopup />)

    userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('ledger.extension.failed')).toBeInTheDocument()
    expect(screen.getByLabelText('Status is critical')).toBeInTheDocument()
  })
})
