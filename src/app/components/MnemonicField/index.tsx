import * as React from 'react'
import { FormField, TextArea } from 'grommet'

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
    <FormField htmlFor={props.inputElementId} error={props.error ? props.error : ''}>
      <TextArea
        id={props.inputElementId}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        autoFocus={props.autoFocus}
        focusIndicator
        size="medium"
        rows={5}
        fill
      />
    </FormField>
  )
}
