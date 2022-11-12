import * as React from 'react'
import { Box, FormField, TextArea } from 'grommet'

interface Props {
  placeholder?: string
  inputElementId: string

  autoFocus?: boolean
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string | false
}

export function MnemonicField(props: Props) {
  return (
    <Box border={false}>
      <FormField htmlFor={props.inputElementId} error={props.error ? props.error : ''}>
        <Box border={false}>
          <TextArea
            id={props.inputElementId}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            autoFocus={props.autoFocus}
            size="medium"
            rows={5}
            fill
          />
        </Box>
      </FormField>
    </Box>
  )
}
