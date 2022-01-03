/**
 *
 * AmountTextInput
 *
 */
import React from 'react'
import { Box, Button, FormField, TextInput } from 'grommet'

interface Props {
  disabled: boolean
  handleMaxValue: () => void
  inline?: boolean
  label?: string
  max?: number
  min?: number
  placeholder?: string
}

const contentProps = {
  border: { position: 'inner' },
  round: 'xsmall',
}

export function AmountTextInput({
  disabled,
  handleMaxValue,
  inline = false,
  label,
  max,
  min = 0,
  placeholder = '0',
}: Props) {
  return (
    <>
      <FormField
        contentProps={inline ? contentProps : {}}
        htmlFor="amount-id"
        label={label}
        name="amount"
        validate={{
          regexp: /^\d*((\.|,)\d{0,9})?$/,
          message: 'Accepts numbers with 9 decimal precision',
        }}
      >
        <TextInput
          data-testid="amount"
          id="amount-id"
          lang="en-US"
          max={max}
          min={min}
          name="amount"
          placeholder={placeholder}
          required
          step="any"
          type="number"
        />
      </FormField>
      <Box justify="end" align="flex-end">
        <Button size="small" label="100%" onClick={handleMaxValue} disabled={disabled} />
      </Box>
    </>
  )
}
