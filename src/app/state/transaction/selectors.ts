import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.transaction || initialState

export const selectTransaction = createSelector([selectSlice], state => state)
export const selectTransactionStep = createSelector([selectTransaction], transaction => transaction.step)
export const selectTransactionPreview = createSelector(
  [selectTransaction],
  transaction => transaction.preview,
)
