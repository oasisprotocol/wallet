import * as React from 'react'
import { FormField } from 'grommet/es6/components/FormField'
import { TextArea } from 'grommet/es6/components/TextArea'

import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'

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
        {...preventSavingInputsToUserData}
      />
    </FormField>
  )
}
