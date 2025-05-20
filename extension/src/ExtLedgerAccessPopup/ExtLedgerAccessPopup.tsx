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
import { CountdownButton } from 'app/components/CountdownButton'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

const logotype = new URL('../../../public/Icon Blue 192.png', import.meta.url).href

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

export function ExtLedgerAccessPopup() {
  const { t } = useTranslation()
  const [connection, setConnection] = useState<ConnectionStatus>('disconnected')
  const handleConnect = async () => {
    setConnection('connecting')
    try {
      const device = await requestDevice()
      const transport = await TransportWebUSB.create()
      if (device && transport) {
        setConnection('connected')
        // Used to redirect after reopening wallet
        window.localStorage.setItem('oasis_wallet_granted_usb_ledger_timestamp', Date.now().toString())
        setTimeout(() => window.close(), 5_000)
      }
    } catch {
      setConnection('error')
    }
  }

  return (
    <Box
      style={{ minHeight: '100dvh' }}
      justify="center"
      align="stretch"
      pad="xlarge"
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
          {t('ledger.extension.grantAccess', 'Grant access to your USB Ledger')}
        </Header>
        <Box gap="medium">
          <p>{t('ledger.instructionSteps.connectUsbLedger', 'Connect your Ledger to this device via USB')}</p>

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
            <Box>
              <ConnectionStatusIcon label={t('ledger.extension.succeed', 'Device connected')} withMargin />

              <CountdownButton
                onClick={() => window.close()}
                label={t('ledger.extension.closingPopup', 'Closing... Please re-open the wallet app')}
              />
            </Box>
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
