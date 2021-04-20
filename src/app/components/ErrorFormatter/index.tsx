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

  const errorMap: { [code in WalletErrors]: string } = {
    [WalletErrors.UnknownError]: t('errors.unknown', {
      message: props.message,
    }),
    [WalletErrors.InvalidAddress]: t('errors.invalidAddress'),
    [WalletErrors.InvalidPrivateKey]: t('errors.invalidPrivateKey'),
    [WalletErrors.InsufficientBalance]: t('errors.insufficientBalance'),
    [WalletErrors.CannotSendToSelf]: t('errors.cannotSendToSelf'),
    [WalletErrors.InvalidNonce]: t('errors.invalidNonce'),
    [WalletErrors.DuplicateTransaction]: t('errors.duplicateTransaction'),
  }

  const error = errorMap[props.code]
  return <>{error}</>
}
