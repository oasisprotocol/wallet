/**
 *
 * TransactionStatus
 *
 */
import { AlertBox } from 'app/components/AlertBox'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorPayload } from 'types/errors'
import { ErrorFormatter } from '../ErrorFormatter'

interface Props {
  error?: ErrorPayload
  success?: boolean
}

export const TransactionStatus = memo((props: Props) => {
  const { error, success } = props
  const { t } = useTranslation()

  return (
    <>
      {error && (
        <AlertBox color="status-error">
          <ErrorFormatter code={error.code} message={error.message} />
        </AlertBox>
      )}
      {success && (
        <AlertBox color="status-ok-weak">
          {t(
            'account.sendTransaction.success',
            'Transaction successfully sent. The transaction might take up to a minute to appear on your account.',
          )}
        </AlertBox>
      )}
    </>
  )
})
