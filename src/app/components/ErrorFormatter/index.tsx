/**
 *
 * ErrorFormatter
 *
 */
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { WalletErrors } from 'types/errors'

interface Props {
  code: WalletErrors
  message?: string
}

export function ErrorFormatter(props: Props) {
  const { t } = useTranslation()
  const message = props.message

  const errorMap: { [code in WalletErrors]: string } = {
    [WalletErrors.UnknownError]: t('errors.unknown', {
      message,
    }),
    [WalletErrors.InvalidAddress]: t('errors.invalidAddress'),
    [WalletErrors.InvalidPrivateKey]: t('errors.invalidPrivateKey'),
    [WalletErrors.InsufficientBalance]: t('errors.insufficientBalance'),
    [WalletErrors.CannotSendToSelf]: t('errors.cannotSendToSelf'),
    [WalletErrors.InvalidNonce]: t('errors.invalidNonce'),
    [WalletErrors.DuplicateTransaction]: t('errors.duplicateTransaction'),
    [WalletErrors.NoOpenWallet]: t('errors.noOpenWallet'),
    [WalletErrors.USBTransportError]: t('errors.usbTransportError', 'USB Transport error: {{message}}', {
      message,
    }),
    [WalletErrors.LedgerAppVersionNotSupported]: t(
      'errors.ledgerAppVersionNotSupported',
      'Received: "Ledger App Version not supported", this can be a false positive, retry the operation, if the error persists, update the Oasis App on your Ledger.',
    ),
    [WalletErrors.LedgerTransactionRejected]: t(
      'errors.ledgerTransactionRejected',
      'Transaction rejected on Ledger',
    ),
    [WalletErrors.LedgerNoDeviceSelected]: t(
      'errors.ledgerNoDeviceSelected',
      'No ledger selected. If you wish to open your ledger, close this message and retry.',
    ),
    [WalletErrors.LedgerCannotOpenOasisApp]: t(
      'errors.ledgerCannotOpenOasisApp',
      'Could not open Oasis App on Ledger, make sure it is unlocked and that the Oasis App is opened.',
    ),
    [WalletErrors.LedgerUnknownError]: t('errors.unknownLedgerError', 'Unknown ledger error: {{message}}', {
      message,
    }),
  }

  const error = errorMap[props.code]
  return <>{error}</>
}
