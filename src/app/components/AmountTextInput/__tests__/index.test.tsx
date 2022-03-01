import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AmountTextInput } from '..'

describe('<AmountTextInput  />', () => {
  const handleChange = jest.fn()
  const defaultProps = {
    handleChange,
    label: 'Field Label',
    max: 2.0121,
    min: 1,
    placeholder: 'Placeholder',
    value: '0',
  }

  it('should render component', () => {
    render(<AmountTextInput {...defaultProps} />)

    const input = screen.getByTestId('amount-form-field')

    expect(input).toHaveAttribute('min', '1')
    expect(input).toHaveAttribute('max', '2.0121')
    expect(input).toHaveAttribute('placeholder', 'Placeholder')
    expect(screen.getByText('Field Label')).toBeInTheDocument()
  })

  it('should trigger handleChange after clicking a button', () => {
    render(<AmountTextInput {...defaultProps} />)

    userEvent.click(screen.getByRole('button'))

    expect(handleChange).toHaveBeenCalledWith('2.0121')
  })

  it('should disable button when there is no availableAmount', () => {
    render(<AmountTextInput {...defaultProps} max={0} />)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
