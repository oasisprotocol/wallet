import { Box, Button, Form, FormField, TextArea, TextInput } from 'grommet'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export function E2EPage() {
  const navigate = useNavigate()
  const [showUnsafeInputs, setShowUnsafeInputs] = React.useState(false as false | 'firefox' | 'chrome')

  return (
    <div>
      {!showUnsafeInputs && (
        <div>
          <Button onClick={() => setShowUnsafeInputs('chrome')} label="Show unsafe inputs for Chrome" />
          <Button onClick={() => setShowUnsafeInputs('firefox')} label="Show unsafe inputs for Firefox" />
        </div>
      )}

      {showUnsafeInputs && (
        <Form onSubmit={() => navigate('/')}>
          <FormField>
            <TextArea name="mnemonic" placeholder="Unsafe mnemonic" autoComplete="mnemonic" />
          </FormField>

          <UnsafePasswordField
            name="privatekey"
            placeholder="Unsafe privateKey"
            autoComplete="privateKey"
            toggleLabel="Show private key"
            // Firefox detects toggling from password, so only plain inputs are unsafe
            passwordIsVisible={showUnsafeInputs === 'firefox'}
          ></UnsafePasswordField>

          <UnsafePasswordField
            name="password"
            placeholder="Unsafe password"
            autoComplete="on"
            toggleLabel="Show password"
            // Firefox detects toggling from password, so only plain inputs are unsafe
            passwordIsVisible={showUnsafeInputs === 'firefox'}
          ></UnsafePasswordField>

          <Button type="submit" label="Submit" />
        </Form>
      )}
    </div>
  )
}

function UnsafePasswordField(props: {
  name: string
  placeholder: string
  autoComplete: string
  toggleLabel: string
  passwordIsVisible: boolean
}) {
  const [passwordIsVisible, setPasswordIsVisible] = React.useState(props.passwordIsVisible)
  return (
    <FormField>
      <Box direction="row" align="center">
        <TextInput
          name={props.name}
          placeholder={props.placeholder}
          type={passwordIsVisible ? 'text' : 'password'}
          autoComplete={props.autoComplete}
          plain
        />
        <Button label={props.toggleLabel} onClick={() => setPasswordIsVisible(!passwordIsVisible)} />
      </Box>
    </FormField>
  )
}
