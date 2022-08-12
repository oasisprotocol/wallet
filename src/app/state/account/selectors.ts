import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.account || initialState

export const selectAccount = createSelector([selectSlice], state => state)
export const selectTransactions = createSelector([selectAccount], account => account.transactions)
export const selectTransactionsError = createSelector([selectAccount], account => account.transactionsError)
export const selectAccountAddress = createSelector([selectAccount], account => account.address)
export const selectAccountAvailableBalance = createSelector([selectAccount], account => account.available)
export const selectAccountIsLoading = createSelector([selectAccount], account => account.loading)
