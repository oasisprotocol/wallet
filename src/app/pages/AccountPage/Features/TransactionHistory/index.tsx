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

import {
  selectAccountAddress,
  selectTransactions,
  selectTransactionsError,
} from '../../../../state/account/selectors'
import { selectSelectedNetwork } from 'app/state/network/selectors'

interface Props {}

/**
 * Displays the past transactions from the state for a given account
 */
export function TransactionHistory(props: Props) {
  const { t } = useTranslation()
  const allTransactions = useSelector(selectTransactions)
  const transactionsError = useSelector(selectTransactionsError)
  const address = useSelector(selectAccountAddress)
  const network = useSelector(selectSelectedNetwork)
  const transactionComponents = allTransactions.map((t, i) => (
    <Transaction key={i} transaction={t} referenceAddress={address} network={network} />
  ))

  return (
    <Box gap="small" margin="none">
      {transactionsError && (
        <p>
          {t(
            'account.transaction.loadingError',
            "Couldn't load transactions. List may be empty or out of date.",
          )}{' '}
          {transactionsError}
        </p>
      )}
      {allTransactions.length ? (
        transactionComponents
      ) : (
        <Box
          round="5px"
          border={{ color: 'background-front-border', size: '1px' }}
          background="background-front"
          pad="large"
        >
          <Heading level="3">{t('account.summary.noTransactionFound', 'No transactions found.')}</Heading>
        </Box>
      )}
    </Box>
  )
}
