import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { FormField } from 'grommet/es6/components/FormField'
import { TextInput } from 'grommet/es6/components/TextInput'
import { Tip } from 'grommet/es6/components/Tip'
import { View } from 'grommet-icons/es6/icons/View'
import { Hide } from 'grommet-icons/es6/icons/Hide'
import * as React from 'react'

interface Props<TFormValue> {
  name: Extract<keyof TFormValue, string>
  label?: string
  placeholder?: string
  inputElementId: string

  autoFocus?: boolean
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  suggestions?: Array<{ label: string; value: any }>
  validate?: (password: string, form: TFormValue) => string | undefined
  error?: string | false
  required?: boolean
  showTip: string
  hideTip: string

  width?: string
}

export function PasswordField<TFormValue = any>(props: Props<TFormValue>) {
  const [passwordIsVisible, setPasswordIsVisible] = React.useState(false)

  return (
    <Box width={{ max: props.width }}>
      <FormField
        name={props.name}
        htmlFor={props.inputElementId}
        label={props.label}
        validate={props.validate}
        error={props.error ? props.error : ''}
      >
        <Box direction="row" align="center">
          <TextInput
            id={props.inputElementId}
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            type={passwordIsVisible ? 'text' : 'password'}
            required={props.required}
            autoFocus={props.autoFocus}
            plain
            suggestions={props.suggestions}
            {...preventSavingInputsToUserData}
          />
          <Tip content={passwordIsVisible ? props.hideTip : props.showTip}>
            <Button
              onClick={() => setPasswordIsVisible(!passwordIsVisible)}
              icon={passwordIsVisible ? <View /> : <Hide />}
              a11yTitle={passwordIsVisible ? props.hideTip : props.showTip}
            />
          </Tip>
        </Box>
      </FormField>
    </Box>
  )
}
