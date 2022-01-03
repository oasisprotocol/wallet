import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AmountTextInput } from '..'

describe('<AmountTextInput  />', () => {
  const handleMaxValue = jest.fn()
  const defaultProps = {
    disabled: false,
    handleMaxValue,
    label: 'Field Label',
  }

  it('should trigger a callback after clicking a button', () => {
    render(<AmountTextInput {...defaultProps} />)

    userEvent.click(screen.getByRole('button'))
  })

  it('should disable button', () => {
    render(<AmountTextInput {...defaultProps} disabled={true} />)

    const button = screen.getByRole('button')
    userEvent.click(button)

    expect(button).toBeDisabled()
  })

  it('should set custom max and min attributes', () => {
    render(<AmountTextInput {...defaultProps} min={1} max={9} />)

    const input = screen.getByTestId('amount')

    expect(input).toHaveAttribute('min', '1')
    expect(input).toHaveAttribute('max', '9')
  })
})
