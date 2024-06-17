import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StatusCritical } from 'grommet-icons/es6/icons/StatusCritical'
import { Box } from 'grommet/es6/components/Box'
import { AlertBox } from 'app/components/AlertBox'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'

export const TransactionError = () => {
  const { t } = useTranslation()
  const {
    clearTransactionForm,
    isDepositing,
    isEvmcParaTime,
    paraTimeName,
    ticker,
    transactionError,
    transactionForm,
  } = useParaTimes()
  const { navigateToConfirmation } = useParaTimesNavigation()

  return (
    <ParaTimeContent
      description={
        isDepositing ? (
          <Trans
            i18nKey="paraTimes.error.depositDescription"
            t={t}
            values={{
              address: transactionForm.recipient,
              paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
              paraTime: paraTimeName,
              ticker,
              value: transactionForm.amount,
            }}
            defaults="Transaction failed. We were not able to complete deposit of <strong>{{value}} {{ticker}}</strong> to <strong>{{address}}</strong> on <strong>{{paraTime}}</strong> {{paratimeType}}"
          />
        ) : (
          <Trans
            i18nKey="paraTimes.error.withdrawDescription"
            t={t}
            values={{
              address: transactionForm.recipient,
              paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
              paraTime: paraTimeName,
              ticker,
              value: transactionForm.amount,
            }}
            defaults="Transaction failed. We were not able to complete withdrawal of <strong>{{value}} {{ticker}}</strong> from <strong>{{paraTime}}</strong> {{paratimeType}} to <strong>{{address}}</strong>"
          />
        )
      }
    >
      {transactionError && (
        <Box margin={{ bottom: 'medium' }} align="center" gap="medium">
          <StatusCritical size="80px" color="status-error" />
          <AlertBox
            status="error"
            content={<ErrorFormatter code={transactionError.code} message={transactionError.message} />}
          />
        </Box>
      )}

      <ParaTimeFormFooter
        primaryLabel={t('paraTimes.summary.navigate', 'Navigate to ParaTime Transfers')}
        primaryAction={clearTransactionForm}
        secondaryAction={navigateToConfirmation}
        withNotice={isEvmcParaTime}
      />
    </ParaTimeContent>
  )
}
