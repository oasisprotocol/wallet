/**
 *
 * ErrorFormatter
 *
 */
import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Anchor } from 'grommet'
import { WalletErrors } from 'types/errors'

interface Props {
  code: WalletErrors
  message?: string
}

export function ErrorFormatter(props: Props) {
  const { t } = useTranslation()
  const message = props.message

  const errorMap: { [code in WalletErrors]: string | React.ReactElement } = {
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
    [WalletErrors.USBTransportNotSupported]: t(
      'errors.usbTransportNotSupported',
      'Your browser does not support WebUSB (e.g. Firefox). Try using Chrome.',
    ),
    [WalletErrors.USBTransportError]: t('errors.usbTransportError', 'USB Transport error: {{message}}.', {
      message,
    }),
    [WalletErrors.LedgerAppVersionNotSupported]: t(
      'errors.ledgerAppVersionNotSupported',
      'Oasis App on Ledger is closed or outdated. Make sure Ledger is unlocked, the Oasis App is opened and up to date.',
    ),
    [WalletErrors.LedgerTransactionRejected]: t(
      'errors.ledgerTransactionRejected',
      'Transaction rejected on Ledger.',
    ),
    [WalletErrors.LedgerNoDeviceSelected]: (
      <Trans
        i18nKey="errors.ledgerNoDeviceSelected"
        t={t}
        defaults="No Ledger device selected. Make sure it is connected, <0>check common USB connection issues with Ledger</0>, and <1>check site permissions don't block USB devices</1>."
        components={[
          <Anchor
            href="https://support.ledger.com/hc/en-us/articles/115005165269-Fix-USB-connection-issues-with-Ledger-Live?support=true"
            target="_blank"
            rel="noopener"
          />,
          <Anchor href="https://support.google.com/chrome/answer/114662" target="_blank" rel="noopener" />,
        ]}
      />
    ),
    [WalletErrors.LedgerCannotOpenOasisApp]: t(
      'errors.ledgerCannotOpenOasisApp',
      'Could not open Oasis App on Ledger. Make sure Ledger is unlocked and the Oasis App is opened.',
    ),
    [WalletErrors.LedgerOasisAppIsNotOpen]: t(
      'errors.LedgerOasisAppIsNotOpen',
      'Oasis App on Ledger is closed.',
    ),
    [WalletErrors.LedgerUnknownError]: t('errors.unknownLedgerError', 'Unknown ledger error: {{message}}', {
      message,
    }),
  }

  const error = errorMap[props.code]
  return <>{error}</>
}
