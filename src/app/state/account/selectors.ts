import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'
import { selectSelectedNetwork } from '../network/selectors'
import { TRANSACTIONS_LIMIT } from '../../../config'
import { TransactionStatus } from '../transaction/types'

const selectSlice = (state: RootState) => state.account || initialState

export const selectAccount = createSelector([selectSlice], state => state)
export const selectTransactions = createSelector([selectAccount], account => account.transactions)
export const selectTransactionsError = createSelector([selectAccount], account => account.transactionsError)
export const selectAccountAddress = createSelector([selectAccount], account => account.address)
export const selectAccountAvailableBalance = createSelector([selectAccount], account => account.available)
export const selectAccountIsLoading = createSelector([selectAccount], account => account.loading)
export const selectAccountAllowances = createSelector([selectAccount], account => account.allowances)
export const selectPendingTransactions = createSelector(
  [selectAccount],
  account => account.pendingTransactions,
)
export const selectAccountNonce = createSelector([selectAccount], account => account.nonce ?? '0')
export const selectPendingTransactionForAccount = createSelector(
  [selectPendingTransactions, selectSelectedNetwork],
  (pendingTransactions, networkType) => pendingTransactions[networkType] ?? [],
)
export const hasAccountUnknownPendingTransactions = createSelector(
  [selectAccountNonce, selectTransactions, selectAccountAddress],
  (accountNonce, transactions, accountAddress) => {
    if (!transactions.length && accountNonce && process.env.REACT_APP_BACKEND === 'oasisscanV2') {
      // Don't bother when tx list is empty in this case. Oasis Scan v2 API is missing historical data.
      // Account have nonce and 0 transactions due to last correctly indexed block 16817956 (2023-11-29)
      return false
    }
    if (transactions.some(tx => tx.status === TransactionStatus.Pending)) {
      // After paratime deposit transaction is submitted, Nexus API returns empty status until one block later.
      // https://github.com/oasisprotocol/explorer/issues/528
      return true
    }
    const noncesFromTxs = transactions
      .filter(tx => !tx.runtimeId)
      .filter(tx => tx.from !== undefined)
      .filter(tx => tx.from === accountAddress)
      .filter(tx => tx.nonce !== undefined)
      .map(tx => BigInt(tx.nonce!))

    if (noncesFromTxs.length <= 0) {
      // TODO: last transaction that affected nonce is not in the initial page of account's transactions
      if (transactions.length >= TRANSACTIONS_LIMIT) return false
      // if we cannot find any noncesFromTxs this probably means that account is missing some part of historical data
      if (!noncesFromTxs.length && process.env.REACT_APP_BACKEND === 'oasisscanV2') return false
      // Waiting for first transactions
      return BigInt(accountNonce) > 0n
    }

    const maxNonceFromTxs = noncesFromTxs.reduce((acc, nonce) => (nonce > acc ? nonce : acc))
    return BigInt(accountNonce) > maxNonceFromTxs + 1n
  },
)
