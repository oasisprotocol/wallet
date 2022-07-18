import { PayloadAction } from '@reduxjs/toolkit'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'

import { DebondingDelegation, Delegation, StakingState, Validators, ValidatorDetails } from './types'

export const initialState: StakingState = {
  debondingDelegations: null,
  delegations: null,
  updateDelegationsError: undefined,
  validators: null,
  updateValidatorsError: undefined,
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
      state.updateValidatorsError = undefined
      state.validators = action.payload
    },
    updateValidatorsError(state, action: PayloadAction<{ error: ErrorPayload; validators: Validators }>) {
      state.updateValidatorsError = action.payload.error
      state.validators = action.payload.validators
    },
    updateDelegations(
      state,
      action: PayloadAction<{ delegations: Delegation[]; debondingDelegations: DebondingDelegation[] }>,
    ) {
      state.updateDelegationsError = undefined
      state.delegations = action.payload.delegations
      state.debondingDelegations = action.payload.debondingDelegations
    },
    updateDelegationsError(state, action: PayloadAction<ErrorPayload>) {
      state.updateDelegationsError = action.payload
      // TODO: keep old state if loading the same account
      state.delegations = null
      state.debondingDelegations = null
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
