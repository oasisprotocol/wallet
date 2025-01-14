import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { FormField } from 'grommet/es6/components/FormField'
import { TextArea } from 'grommet/es6/components/TextArea'
import { TextInput } from 'grommet/es6/components/TextInput'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as monitor from 'vendors/monitor'
import * as oasisscanV2 from 'vendors/oasisscan-v2'
import * as nexus from 'vendors/nexus'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { useDispatch, useStore } from 'react-redux'
import { walletActions } from '../../state/wallet'
import { AlertBox, AlertBoxStatus } from '../../components/AlertBox'
import { Info } from 'grommet-icons/es6/icons/Info'
import { Text } from 'grommet/es6/components/Text'

export function E2EPage() {
  return (
    <div>
      <ExposeInternals></ExposeInternals>
      <br />
      <TestUnsafeInputs></TestUnsafeInputs>
      <br />
      <TriggerError></TriggerError>
      <br />
      <DemoAlertBoxes></DemoAlertBoxes>
    </div>
  )
}

interface e2eWindow extends Window {
  monitor: any
  oasisscan: any
  oasisscanV2: any
  nexus: any
  oasis: any
  oasisRT: any
  store: any
}
declare const window: e2eWindow

function ExposeInternals() {
  const store = useStore()
  useEffect(() => {
    window.monitor = monitor
    window.oasisscanV2 = oasisscanV2
    window.nexus = nexus
    window.oasis = oasis
    window.oasisRT = oasisRT
    window.store = store
    return () => {
      // Keep globals even after redirecting away
    }
  }, [store])
  return <></>
}

function TestUnsafeInputs() {
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

function TriggerError() {
  const dispatch = useDispatch()
  return (
    <div>
      <Button
        label="Trigger fatal saga error"
        onClick={() => {
          dispatch(walletActions.openWalletFromPrivateKey({ privateKey: '0xAA', choosePassword: undefined }))
        }}
      />
      <Button
        label="Trigger uncaught error"
        onClick={() => {
          // @ts-expect-error Function does not exist
          functionDoesNotExist()
        }}
      />
    </div>
  )
}

function DemoAlertBoxes() {
  return (
    <Box direction="row">
      <Box width={'400px'} background={{ dark: false }}>
        <Box background="background-front" pad={'large'}>
          <DemoAlertBox status="ok-weak" />
          <DemoAlertBox status="ok" />
          <DemoAlertBox status="warning" />
          <DemoAlertBox status="error" />
          <Text color="status-ok">status-ok</Text>
          <Text color="status-warning">status-warning</Text>
          <Text color="status-error">status-error</Text>
        </Box>
      </Box>
      <Box width={'400px'} background={{ dark: true }}>
        <Box background="background-front" pad={'large'}>
          <DemoAlertBox status="ok-weak" />
          <DemoAlertBox status="ok" />
          <DemoAlertBox status="warning" />
          <DemoAlertBox status="error" />
          <Text color="status-ok">status-ok</Text>
          <Text color="status-warning">status-warning</Text>
          <Text color="status-error">status-error</Text>
        </Box>
      </Box>
    </Box>
  )
}

function DemoAlertBox({ status }: { status: AlertBoxStatus }) {
  return (
    <>
      <AlertBox status={status} icon={<Info />}>
        LOREM {status}
      </AlertBox>
      <br />
    </>
  )
}
