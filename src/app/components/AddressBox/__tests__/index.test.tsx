import copy from 'copy-to-clipboard'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AddressBox, EditableAddressBox, EditableNameBox } from '../index'

jest.mock('copy-to-clipboard')

const testAddress = 'oasis1qqurxkgavtcjjytneumeclx59ds3avjaqg7ftqph'

const renderComponent = () => render(<AddressBox address={testAddress} />)

describe('<AddressBox />', () => {
  it('should render address properly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it('should be able to copy address to clipboard', async () => {
    renderComponent()
    await userEvent.click(screen.getByTestId('copy-address-icon'))
    expect(copy).toHaveBeenCalledWith(testAddress)
  })

  it('should be able to show a notification', async () => {
    renderComponent()
    jest.mocked(copy).mockReturnValue(true) // Copy must return true so that the notification is actually displayed
    await userEvent.click(screen.getByTestId('copy-address-icon'))
    expect(await screen.getByText('account.addressCopied')).toBeInTheDocument()
  })
})

const openEditModal = jest.fn()
const renderEditableNameBoxComponent = () =>
  render(<EditableNameBox address={testAddress} name="My Wallet" openEditModal={openEditModal} />)

describe('<EditableNameBox />', () => {
  it('should render name properly', () => {
    const { container } = renderEditableNameBoxComponent()
    expect(container).toMatchSnapshot()
  })

  it('should render edit icon', async () => {
    renderEditableNameBoxComponent()
    expect(screen.queryByTestId('editable-address-edit-button')).not.toBeInTheDocument()
    await userEvent.click(screen.getByTestId('editable-name-edit-button'))
    expect(openEditModal).toHaveBeenCalled()
  })

  it('should be able to copy address to clipboard', async () => {
    renderEditableNameBoxComponent()
    expect(screen.queryByTestId('copy-address-icon')).not.toBeInTheDocument()
    await userEvent.click(screen.getByTestId('copy-address-button'))
    expect(copy).toHaveBeenCalledWith(testAddress)
  })
})

const renderEditableAddressBoxComponent = () =>
  render(<EditableAddressBox openEditModal={openEditModal} address={testAddress} />)

describe('<EditableAddressBox />', () => {
  it('should render edit icon', async () => {
    renderEditableAddressBoxComponent()
    expect(screen.queryByTestId('editable-name-edit-button')).not.toBeInTheDocument()
    await userEvent.click(screen.getByTestId('editable-address-edit-button'))
    expect(openEditModal).toHaveBeenCalled()
  })

  it('should be able to copy address to clipboard', async () => {
    renderEditableAddressBoxComponent()
    expect(screen.queryByTestId('copy-address-button')).not.toBeInTheDocument()
    await userEvent.click(screen.getByTestId('copy-address-icon'))
    expect(copy).toHaveBeenCalledWith(testAddress)
  })
})
