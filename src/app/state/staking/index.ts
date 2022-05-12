import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

import { DebondingDelegation, Delegation, StakingState, Validators, ValidatorDetails } from './types'

export const initialState: StakingState = {
  debondingDelegations: [],
  delegations: [],
  validators: null,
  updateValidatorsError: null,
  selectedValidatorDetails: null,
  selectedValidator: null,
  loading: false,
}

const slice = createSlice({
  name: 'staking',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    fetchAccount(state, action: PayloadAction<string>) {},
    updateValidators(state, action: PayloadAction<Validators>) {
      state.updateValidatorsError = null
      state.validators = action.payload
    },
    updateValidatorsError(state, action: PayloadAction<{ error: string; validators: Validators }>) {
      state.updateValidatorsError = action.payload.error
      state.validators = action.payload.validators
    },
    updateDelegations(state, action: PayloadAction<Delegation[]>) {
      state.delegations = action.payload
    },
    updateDebondingDelegations(state, action: PayloadAction<DebondingDelegation[]>) {
      state.debondingDelegations = action.payload
    },
    validatorSelected(state, action: PayloadAction<string>) {
      state.selectedValidator = action.payload
      state.selectedValidatorDetails = null
    },
    validatorDeselected(state, action: PayloadAction<void>) {
      state.selectedValidator = null
      state.selectedValidatorDetails = null
    },
    updateValidatorDetails(state, action: PayloadAction<ValidatorDetails>) {
      state.selectedValidatorDetails = action.payload
    },
  },
})

export const { actions: stakingActions, reducer: stakingReducer } = slice

export default slice.reducer
