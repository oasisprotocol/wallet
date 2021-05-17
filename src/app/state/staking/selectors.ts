import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.staking || initialState

export const selectStaking = createSelector([selectSlice], state => state)
export const selectValidators = createSelector([selectStaking], state => state.validators)
export const selectSelectedAddress = createSelector([selectStaking], state => state.selectedValidator)
export const selectValidatorDetails = createSelector([selectStaking], state => state.selectedValidatorDetails)
export const selectActiveDelegations = createSelector([selectStaking], state => state.delegations)
export const selectDebondingDelegations = createSelector([selectStaking], state => state.debondingDelegations)
