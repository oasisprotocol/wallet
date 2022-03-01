/**
 *
 * AmountTextInput
 *
 */
import React from 'react'
import { Box, Button, FormField, TextInput } from 'grommet'

interface Props {
  handleChange: (value: string) => void
  inline?: boolean
  label?: string
  max: number
  min?: number
  placeholder?: string
  value: string
}

const contentProps = {
  background: 'background-front',
  border: { position: 'inner' },
  round: 'xsmall',
}

export function AmountTextInput({
  handleChange,
  inline = false,
  label,
  max,
  min = 0,
  placeholder = '0',
  value,
}: Props) {
  return (
    <>
      <FormField contentProps={inline ? contentProps : {}} htmlFor="amount-id" label={label} name="amount">
        <TextInput
          data-testid="amount-form-field"
          id="amount-id"
          max={max}
          min={min}
          name="amount"
          onChange={event => handleChange(event.target.value)}
          placeholder={placeholder}
          required
          step="any"
          type="number"
          value={value}
        />
      </FormField>
      <Box justify="end" align="flex-end">
        <Button disabled={max === 0} label="100%" onClick={() => handleChange(max.toString())} size="small" />
      </Box>
    </>
  )
}
