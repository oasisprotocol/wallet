/* eslint-disable no-restricted-syntax */

/**
 *
 * TransactionHistory
 *
 */
import { Transaction } from 'app/components/Transaction'
import { Box } from 'grommet/es6/components/Box'
import { Heading } from 'grommet/es6/components/Heading'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import {
  hasAccountUnknownPendingTransactions,
  selectAccountAddress,
  selectPendingTransactionForAccount,
  selectTransactions,
  selectTransactionsError,
} from 'app/state/account/selectors'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { ErrorFormatter } from 'app/components/ErrorFormatter'

/**
 * Displays the past transactions from the state for a given account
 */
export function TransactionHistory() {
  const { t } = useTranslation()
  const allTransactions = useSelector(selectTransactions)
  const transactionsError = useSelector(selectTransactionsError)
  const address = useSelector(selectAccountAddress)
  // TODO: Remove pending transaction once it is available in allTransactions in transactionsLoaded
  const pendingTransactions = useSelector(selectPendingTransactionForAccount)
  const hasUnknownPendingTransactions = useSelector(hasAccountUnknownPendingTransactions)
  const network = useSelector(selectSelectedNetwork)
  const transactionComponents = allTransactions.map(t => (
    <Transaction key={t.hash} transaction={t} referenceAddress={address} network={network} />
  ))
  const pendingTransactionComponents = pendingTransactions
    .filter(({ hash: pendingTxHash }) => !allTransactions.some(({ hash }) => hash === pendingTxHash))
    .map(t => <Transaction key={t.hash} transaction={t} referenceAddress={address} network={network} />)

  return (
    <Box gap="medium" margin="none">
      {transactionsError && (
        <p>
          {t('account.transaction.loadingError', `Couldn't load transactions.`)}{' '}
          <ErrorFormatter code={transactionsError.code} message={transactionsError.message} />
        </p>
      )}
      {hasUnknownPendingTransactions && (
        <>
          <Heading level="3">Has pending transactions, check on Explorer</Heading>
        </>
      )}
      {!!pendingTransactionComponents.length && (
        <>
          {/*TODO: Translation*/}
          <Heading level="3">Pending transactions</Heading>
          {pendingTransactionComponents}
        </>
      )}
      {/*TODO: Translation*/}
      <Heading level="3">Activity</Heading>
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
