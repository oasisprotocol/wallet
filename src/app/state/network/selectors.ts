import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.network || initialState

export const selectNetwork = createSelector([selectSlice], state => state)
export const selectTicker = createSelector([selectSlice], state => state.ticker)
