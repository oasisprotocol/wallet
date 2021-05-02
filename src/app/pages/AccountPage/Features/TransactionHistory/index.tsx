/**
 *
 * TransactionHistory
 *
 */
import { Transaction } from 'app/components/Transaction'
import { Box, Heading } from 'grommet'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectAccountAddress, selectTransactions } from '../../../../state/account/selectors'

interface Props {}

/**
 * Displays the past transactions from the state for a given account
 */
export function TransactionHistory(props: Props) {
  const { t } = useTranslation()
  const allTransactions = useSelector(selectTransactions)
  const address = useSelector(selectAccountAddress)
  const transactionComponents = allTransactions.map((t, i) => (
    <Transaction key={i} transaction={t} referenceAddress={address} />
  ))

  return (
    <Box gap="small" margin="none">
      {allTransactions.length ? (
        transactionComponents
      ) : (
        <Box
          round="5px"
          border={{ color: 'background-front-border', size: '1px' }}
          background="background-front"
          pad="large"
        >
          <Heading level="3">{t('account.summary.noTransactionFound', 'No transaction found')}</Heading>
        </Box>
      )}
    </Box>
  )
}
