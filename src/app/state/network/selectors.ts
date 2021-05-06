import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.network || initialState

export const selectSelectedNetwork = createSelector([selectSlice], state => state.selectedNetwork)
export const selectTicker = createSelector([selectSlice], state => state.ticker)
export const selectChainContext = createSelector([selectSlice], state => state.chainContext)
export const selectEpoch = createSelector([selectSlice], state => state.epoch)
export const selectMinStaking = createSelector([selectSlice], state => state.minimumStakingAmount)
