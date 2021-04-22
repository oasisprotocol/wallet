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
    [WalletErrors.USBTransportError]: t('errors.usbTransportError', 'USB Transport error : {message}', {
      message,
    }),
  }

  const error = errorMap[props.code]
  return <>{error}</>
}
