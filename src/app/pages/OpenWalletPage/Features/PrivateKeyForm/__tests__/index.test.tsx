import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PrivateKeyForm } from '..'

const onChange = jest.fn()
const onSubmit = jest.fn()
const renderComponent = (isValid = true) =>
  render(
    <PrivateKeyForm
      description="description"
      isValid={isValid}
      heading="heading"
      onChange={onChange}
      onSubmit={onSubmit}
      value=""
    />,
  )

describe('<PrivateKeyForm  />', () => {
  it('should render component', () => {
    renderComponent()

    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByText('heading')).toBeInTheDocument()

    const input = screen.getByPlaceholderText('openWallet.privateKeyForm.enterPrivateKeyHere')
    const button = screen.getByRole('button', { name: 'openWallet.import' })

    userEvent.type(input, 'foo')
    userEvent.click(button)

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should change visibility of a private key value in text input', () => {
    renderComponent()

    const button = screen.getByTestId('private-key-visibility')
    const input = screen.getByPlaceholderText('openWallet.privateKeyForm.enterPrivateKeyHere')

    expect(input).toHaveAttribute('type', 'password')
    userEvent.click(button)
    expect(input).toHaveAttribute('type', 'text')
  })

  it('should render error message', () => {
    renderComponent(false)

    expect(screen.getByText('openWallet.privateKeyForm.error')).toBeInTheDocument()
  })
})
