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
export const selectAccountTotalNumOfTxs = createSelector([selectAccount], account => account.totalNumOfTxs ?? 0)
export const selectPendingTransactionForAccount = createSelector(
  [selectPendingTransactions, selectSelectedNetwork],
  (pendingTransactions, networkType) => pendingTransactions[networkType] ?? [],
)

export const hasAccountUnknownPendingTransactions = createSelector(
  [selectAccountNonce, selectAccountTotalNumOfTxs],
  (accountNonce, totalNumberOfTxs) => {
    return BigInt(totalNumberOfTxs) >= BigInt(accountNonce)
  },
)
