import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StatusCritical } from 'grommet-icons/icons'
import { Box } from 'grommet'
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
        <Trans
          i18nKey="paraTimes.error.description"
          t={t}
          values={{
            address: transactionForm.recipient,
            paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
            paraTime: paraTimeName,
            preposition: isDepositing
              ? t('paraTimes.summary.into', 'into')
              : t('paraTimes.summary.from', 'from'),
            ticker,
            value: transactionForm.amount,
          }}
          defaults="Transaction failed. We were not able to transfer <strong>{{value}} {{ticker}}</strong> tokens {{preposition}} the following wallet on the <strong>{{paraTime}}</strong> {{paratimeType}} ParaTime: <strong>{{address}}</strong>"
        />
      }
    >
      {transactionError && (
        <Box margin={{ bottom: 'medium' }} align="center" gap="medium" style={{ maxWidth: '550px' }}>
          <StatusCritical size="80px" color="status-error" />
          <AlertBox color="status-error">
            <ErrorFormatter code={transactionError.code} message={transactionError.message} />
          </AlertBox>
        </Box>
      )}

      <ParaTimeFormFooter
        primaryLabel={t('paraTimes.summary.navigate', 'Navigate to ParaTimes Transfers')}
        primaryAction={clearTransactionForm}
        secondaryAction={navigateToConfirmation}
        withNotice={isEvmcParaTime}
      />
    </ParaTimeContent>
  )
}
