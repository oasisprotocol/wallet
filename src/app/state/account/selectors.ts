import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'
import { selectSelectedNetwork } from '../network/selectors'

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
    const noncesFromTxs = transactions
      .filter(tx => tx.from !== undefined)
      .filter(tx => tx.from === accountAddress)
      .filter(tx => tx.nonce !== undefined)
      .map(tx => BigInt(tx.nonce!))

    if (noncesFromTxs.length <= 0) {
      // TODO: last transaction that affected nonce is not in the initial page of account's transactions
      return BigInt(accountNonce) > 0n
    }

    const maxNonceFromTxs = noncesFromTxs.reduce((acc, nonce) => (nonce > acc ? nonce : acc))
    return BigInt(accountNonce) > maxNonceFromTxs + 1n
  },
)
