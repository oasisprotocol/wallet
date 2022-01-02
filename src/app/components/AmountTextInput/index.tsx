/**
 *
 * AmountTextInput
 *
 */
import React from 'react'
import { Box, Button, FormField, TextInput } from 'grommet'

interface Props {
  disabled: boolean
  label?: string
  min?: number
  max?: number
  placeholder?: string
  handleMaxValue: () => void
  inline?: boolean
}

const contentProps = {
  border: { position: 'inner' },
  round: 'xsmall',
}

export function AmountTextInput({
  disabled,
  label,
  min = 0,
  max,
  handleMaxValue,
  placeholder = '0',
  inline = false,
}: Props) {
  return (
    <>
      <FormField
        htmlFor="amount-id"
        name="amount"
        label={label}
        validate={{
          regexp: /^\d*((\.|,)\d{0,9})?$/,
          message: 'Accepts numbers with 9 decimal precision',
        }}
        contentProps={inline ? contentProps : {}}
      >
        <TextInput
          data-testid="amount"
          id="amount-id"
          lang="en-US"
          name="amount"
          placeholder={placeholder}
          type="number"
          step="any"
          min={min}
          max={max}
          required
        />
      </FormField>
      <Box justify="end" align="flex-end">
        <Button size="small" label="100%" onClick={handleMaxValue} disabled={disabled} />
      </Box>
    </>
  )
}
