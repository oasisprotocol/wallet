import { Box, FormField, Button, TextInput, Tip } from 'grommet'
import { View, Hide } from 'grommet-icons'
import * as React from 'react'

interface Props {
  placeholder: string
  inputElementId: string

  autoComplete: 'on' | 'off' | 'new-password' | 'current-password'
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error: string | false
  showTip: string
  hideTip: string

  width: string
}

export function PasswordField(props: Props) {
  const [passwordIsVisible, setPasswordIsVisible] = React.useState(false)

  return (
    <FormField
      htmlFor={props.inputElementId}
      error={props.error ? props.error : ''}
      border
      contentProps={{ border: props.error ? 'bottom' : false }}
      round="small"
      width={props.width}
    >
      <Box direction="row" align="center">
        <TextInput
          id={props.inputElementId}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          type={passwordIsVisible ? 'text' : 'password'}
          autoComplete={props.autoComplete}
          plain
        />
        <Tip content={passwordIsVisible ? props.hideTip : props.showTip}>
          <Button
            onClick={() => setPasswordIsVisible(!passwordIsVisible)}
            icon={passwordIsVisible ? <View /> : <Hide />}
          />
        </Tip>
      </Box>
    </FormField>
  )
}
