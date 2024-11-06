import { Box } from 'grommet/es6/components/Box'
import React, { useEffect } from 'react'
import { Header } from 'app/components/Header'
import { ButtonLink } from '../../../../components/ButtonLink'
import { Button } from 'grommet/es6/components/Button'
import { Text } from 'grommet/es6/components/Text'
import { canAccessBle, canAccessNavigatorUsb } from '../../../../lib/ledger'
import { useTranslation } from 'react-i18next'
import { Capacitor } from '@capacitor/core'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

type SelectOpenMethodProps = {
  webExtensionUSBLedgerAccess?: () => void
}

export function FromLedger({ webExtensionUSBLedgerAccess }: SelectOpenMethodProps) {
  const { t } = useTranslation()
  const [supportsUsbLedger, setSupportsUsbLedger] = React.useState<boolean | undefined>(true)
  const [hasUsbLedgerAccess, setHasUsbLedgerAccess] = React.useState<boolean | undefined>(undefined)
  const [supportsBleLedger, setSupportsBleLedger] = React.useState<boolean | undefined>(true)

  useEffect(() => {
    async function getLedgerSupport() {
      const usbLedgerSupported = await canAccessNavigatorUsb()

      const isNativePlatform = Capacitor.isNativePlatform()
      const bleLedgerSupported = isNativePlatform && (await canAccessBle())

      setSupportsUsbLedger(usbLedgerSupported)
      setSupportsBleLedger(bleLedgerSupported)
    }

    getLedgerSupport()
  }, [])

  useEffect(() => {
    if (openLedgerAccessPopup) {
      // In default ext popup this gets auto-accepted / auto-rejected. In a tab or persistent popup it would
      // prompt user to select a ledger device. TransportWebUSB.create seems to match requestDevice called in
      // openLedgerAccessPopup.
      // If TransportWebUSB.create() is rejected then call openLedgerAccessPopup and requestDevice. When user
      // confirms the prompt tell them to come back here. TransportWebUSB.create() will resolve.
      TransportWebUSB.create()
        .then(() => setHasUsbLedgerAccess(true))
        .catch(() => setHasUsbLedgerAccess(false))
    } else {
      // Assume true in web app. enumerateAccountsFromLedger will call TransportWebUSB.create in next steps
      // and will prompt user to select a ledger device.
      setHasUsbLedgerAccess(true)
    }
  }, [openLedgerAccessPopup])

  const shouldOpenUsbLedgerAccessPopup = openLedgerAccessPopup && !hasUsbLedgerAccess

  return (
    <Box
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
      background="background-front"
      margin="small"
      pad="medium"
    >
      <Header>
        {t('openWallet.importAccounts.connectDeviceHeader', 'How do you want to connect your Ledger device?')}
      </Header>

      <Box direction="row-responsive" justify="start" margin={{ top: 'medium' }} gap="medium">
        <div>
          <div>
            {shouldOpenUsbLedgerAccessPopup ? (
              <Button
                disabled={!supportsUsbLedger}
                style={{ width: 'fit-content' }}
                onClick={webExtensionUSBLedgerAccess}
                label={t('ledger.extension.grantAccess', 'Grant access to your USB Ledger')}
                primary
              />
            ) : (
              <span>
                <ButtonLink
                  disabled={!supportsUsbLedger}
                  to="usb"
                  label={t('openWallet.importAccounts.usbLedger', 'USB Ledger')}
                  primary
                />
              </span>
            )}
          </div>
          {!supportsUsbLedger && (
            <Text size="small" textAlign="center">
              {t(
                'errors.usbTransportNotSupported',
                'Current platform does not support WebUSB capability. Try on different platform or browser(preferably Chrome).',
              )}
            </Text>
          )}
        </div>
        <div>
          <div>
            <ButtonLink
              disabled={!supportsBleLedger}
              to="ble"
              label={t('openWallet.importAccounts.bluetoothLedger', 'Bluetooth Ledger')}
              primary
            />
          </div>
          {!supportsBleLedger && (
            <Text size="small" textAlign="center">
              {t(
                'errors.bluetoothTransportNotSupported',
                'Bluetooth may be turned off or your current platform does not support Bluetooth capability.',
              )}
            </Text>
          )}
        </div>
      </Box>
    </Box>
  )
}
