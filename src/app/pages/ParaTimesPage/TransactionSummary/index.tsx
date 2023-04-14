import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { StatusGood } from 'grommet-icons/es6/icons/StatusGood'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'

export const TransactionSummary = () => {
  const { t } = useTranslation()
  const { isDepositing, isEvmcParaTime, paraTimeName, clearTransactionForm, ticker, transactionForm } =
    useParaTimes()

  return (
    <ParaTimeContent
      description={
        isDepositing ? (
          <Trans
            i18nKey="paraTimes.summary.depositDescription"
            t={t}
            values={{
              address: transactionForm.recipient,
              paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
              paraTime: paraTimeName,
              ticker,
              value: transactionForm.amount,
            }}
            defaults="You have successfully deposited <strong>{{value}} {{ticker}}</strong> to <strong>{{address}}</strong> on <strong>{{paraTime}}</strong> {{paratimeType}}"
          />
        ) : (
          <Trans
            i18nKey="paraTimes.summary.withdrawDescription"
            t={t}
            values={{
              address: transactionForm.recipient,
              paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
              paraTime: paraTimeName,
              ticker,
              value: transactionForm.amount,
            }}
            defaults="You have successfully withdrawn <strong>{{value}} {{ticker}}</strong> from <strong>{{paraTime}}</strong> {{paratimeType}} to <strong>{{address}}</strong>"
          />
        )
      }
    >
      <Box margin={{ bottom: 'medium' }}>
        <StatusGood size="80px" color="successful-label" />
      </Box>

      <ParaTimeFormFooter
        primaryLabel={t('paraTimes.summary.navigate', 'Navigate to ParaTime Transfers')}
        primaryAction={clearTransactionForm}
        withNotice={isEvmcParaTime}
      />
    </ParaTimeContent>
  )
}
