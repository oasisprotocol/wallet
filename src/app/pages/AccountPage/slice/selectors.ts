import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.account || initialState

export const selectAccount = createSelector([selectSlice], state => state)
export const selectTransactions = createSelector([selectAccount], account => account.transactions)
export const selectAccountAddress = createSelector([selectAccount], account => account.address)
