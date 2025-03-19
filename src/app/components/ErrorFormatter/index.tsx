/**
 *
 * ErrorFormatter
 *
 */
import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Anchor } from 'grommet/es6/components/Anchor'
import { WalletErrors } from 'types/errors'
import { backend } from 'vendors/backend'
import { BackendAPIs } from 'config'

interface Props {
  code: WalletErrors
  message?: string
}

export function ErrorFormatter(props: Props) {
  const { t } = useTranslation()
  const message = props.message

  const backendToLabel = {
    [BackendAPIs.OasisMonitor]: t('backends.oasismonitor', 'Oasis Monitor API'),
    [BackendAPIs.OasisScanV2]: t('backends.oasisscanV2', 'Oasis Scan API v2'),
    [BackendAPIs.Nexus]: t('backends.nexus', 'Nexus API'),
  }

  const ledgerNoDeviceSelectedHelp = (
    <Trans
      i18nKey="errors.ledgerNoDeviceSelected"
      t={t}
      defaults="No Ledger device selected. Make sure it is connected, <LedgerHelp>check common USB connection issues with Ledger</LedgerHelp>, and <ChromeHelp>check site permissions don't block USB devices</ChromeHelp>."
      components={{
        LedgerHelp: (
          <Anchor
            href="https://support.ledger.com/article/115005165269-zd"
            target="_blank"
            rel="noopener"
            style={{ display: 'inline' }}
          />
        ),
        ChromeHelp: (
          <Anchor
            href="https://support.google.com/chrome/answer/114662"
            target="_blank"
            rel="noopener"
            style={{ display: 'inline' }}
          />
        ),
      }}
    />
  )

  const errorMap: { [code in WalletErrors]: string | React.ReactElement } = {
    [WalletErrors.UnknownError]: t('errors.unknown', 'Unknown error: {{message}}', { message }),
    [WalletErrors.UnknownGrpcError]: t('errors.unknownGrpc', 'Unknown gRPC error: {{message}}', { message }),
    [WalletErrors.InvalidAddress]: t('errors.invalidAddress', 'Invalid address'),
    [WalletErrors.InvalidPrivateKey]: t('errors.invalidPrivateKey', 'Invalid private key'),
    [WalletErrors.InsufficientBalance]: t('errors.insufficientBalance', 'Insufficient balance'),
    [WalletErrors.CannotSendToSelf]: t('errors.cannotSendToSelf', 'Cannot send to yourself'),
    [WalletErrors.InvalidNonce]: t('errors.invalidNonce', 'Invalid nonce (transaction number)'),
    [WalletErrors.DuplicateTransaction]: t('errors.duplicateTransaction', 'Duplicate transaction'),
    [WalletErrors.NoOpenWallet]: t('errors.noOpenWallet', 'No wallet opened'),
    [WalletErrors.USBTransportNotSupported]: t(
      'errors.usbTransportNotSupported',
      'Current platform does not support WebUSB capability. Try on different platform or browser (preferably Chrome).',
    ),
    [WalletErrors.USBTransportError]: (
      <span>
        {t('errors.usbTransportError', 'USB Transport error: {{message}}.', {
          message,
        })}{' '}
        {ledgerNoDeviceSelectedHelp}
      </span>
    ),
    [WalletErrors.LedgerAppVersionNotSupported]: t(
      'errors.ledgerAppVersionNotSupported',
      'Oasis App on Ledger is closed or outdated. Make sure Ledger is unlocked, the Oasis App is opened and up to date.',
    ),
    [WalletErrors.LedgerTransactionRejected]: t(
      'errors.ledgerTransactionRejected',
      'Transaction rejected on Ledger.',
    ),
    [WalletErrors.LedgerNoDeviceSelected]: ledgerNoDeviceSelectedHelp,
    [WalletErrors.LedgerCannotOpenOasisApp]: t(
      'errors.ledgerCannotOpenOasisApp',
      'Could not open Oasis App on Ledger. Make sure Ledger is unlocked and the Oasis App is opened.',
    ),
    [WalletErrors.LedgerOasisAppIsNotOpen]: t(
      'errors.LedgerOasisAppIsNotOpen',
      'Oasis App on Ledger is closed.',
    ),
    [WalletErrors.LedgerDerivedDifferentAccount]: t(
      'errors.LedgerDerivedDifferentAccount',
      'This account does not belong to the currently connected Ledger.',
    ),
    [WalletErrors.LedgerUnknownError]: t('errors.unknownLedgerError', 'Unknown ledger error: {{message}}', {
      message,
    }),
    [WalletErrors.IndexerAPIError]: t(
      'errors.indexerAPIError',
      '{{indexerName}} appears to be down, some information may be missing or out of date. Please, come back later.',
      {
        indexerName: backendToLabel[backend()],
      },
    ),
    [WalletErrors.DisconnectedError]: t('errors.disconnectedError', 'Lost connection.'),
    [WalletErrors.ParaTimesUnknownError]: t(
      'errors.unknownParaTimeError',
      'Unknown ParaTime error: {{message}}',
      {
        message,
      },
    ),
    [WalletErrors.BluetoothTransportNotSupported]: t(
      'errors.bluetoothTransportNotSupported',
      'Bluetooth may be turned off or your current platform does not support Bluetooth capability.',
    ),
  }

  const error = errorMap[props.code]
  return <span>{error}</span>
}
