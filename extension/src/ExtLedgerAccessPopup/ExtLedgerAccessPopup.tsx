import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Spinner } from 'grommet/es6/components/Spinner'
import { Text } from 'grommet/es6/components/Text'
import { StatusCritical } from 'grommet-icons/es6/icons/StatusCritical'
import { StatusGood } from 'grommet-icons/es6/icons/StatusGood'
import { Header } from 'app/components/Header'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { AlertBox } from 'app/components/AlertBox'
import { WalletErrors } from 'types/errors'
import { requestDevice } from 'app/lib/ledger'
import logotype from '../../../public/Icon Blue 192.png'
import { MessageTypes } from '../../../src/utils/constants'

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error'
type ConnectionStatusIconPros = {
  success?: boolean
  label: string
  withMargin?: boolean
}

function ConnectionStatusIcon({ success = true, label, withMargin = false }: ConnectionStatusIconPros) {
  return (
    <Box
      align="center"
      direction="row"
      gap="small"
      justify="center"
      margin={{ bottom: withMargin ? 'large' : 'none' }}
    >
      {success ? (
        <StatusGood color="successful-label" size="30px" />
      ) : (
        <StatusCritical color="status-error" size="30px" />
      )}
      <Text weight="bold" size="large" textAlign="center">
        {label}
      </Text>
    </Box>
  )
}

const chrome = (window as any).chrome

export function ExtLedgerAccessPopup() {
  const { t } = useTranslation()
  const [connection, setConnection] = useState<ConnectionStatus>('disconnected')
  const handleConnect = async () => {
    setConnection('connecting')
    try {
      const device = await requestDevice()
      if (device) {
        setConnection('connected')
        chrome?.runtime?.sendMessage({ type: MessageTypes.USB_LEDGER_PERMISSION_GRANTED })
      }
    } catch {
      setConnection('error')
    }
  }

  return (
    <Box
      style={{ minHeight: '100dvh' }}
      justify="center"
      align="center"
      pad="medium"
      background="background-back"
    >
      <Box
        elevation="small"
        round="5px"
        background="background-front"
        pad="large"
        style={{ position: 'relative' }}
      >
        <Box margin={{ bottom: 'medium' }} align="center">
          <img src={logotype} alt="Oasis" width="75" height="75" />
        </Box>
        <Header fill textAlign="center">
          {t('ledger.extension.grantAccess', 'Grant access to your Ledger')}
        </Header>
        <Box gap="medium">
          <ol>
            <li>
              {t(
                'ledger.instructionSteps.connectUsbLedger',
                'Connect your USB Ledger device to the computer',
              )}
            </li>
            <li>{t('ledger.instructionSteps.closeLedgerLive', 'Close Ledger Live app on the computer')}</li>
            <li>{t('ledger.instructionSteps.openOasisApp', 'Open the Oasis App on your Ledger device')}</li>
            <li>
              {t(
                'ledger.extension.instructionStep',
                'Once device is connected continue the operation in the wallet app',
              )}
            </li>
          </ol>

          {connection === 'connecting' && (
            <Box
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
              background={{
                color: 'background-front',
                opacity: 'medium',
              }}
              align="center"
              justify="center"
            >
              <Spinner size="medium" />
            </Box>
          )}
          {connection === 'connected' && (
            <ConnectionStatusIcon label={t('ledger.extension.succeed', 'Device connected')} />
          )}
          {connection === 'error' && (
            <Box margin={{ bottom: 'medium' }}>
              <ConnectionStatusIcon
                success={false}
                label={t('ledger.extension.failed', 'Connection failed')}
                withMargin
              />
              <AlertBox status="error">
                <ErrorFormatter code={WalletErrors.LedgerNoDeviceSelected} />
              </AlertBox>
            </Box>
          )}
          {connection !== 'connected' && (
            <Box justify="center">
              <Button
                onClick={handleConnect}
                label={t('ledger.extension.connect', 'Connect Ledger device')}
                primary
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
