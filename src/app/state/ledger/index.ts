import { PayloadAction } from '@reduxjs/toolkit'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { LedgerAccount, LedgerState, LedgerStep } from './types'

export const initialState: LedgerState = { accounts: [] }

const slice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    clear(state, action: PayloadAction<void>) {
      state.accounts = []
      state.error = undefined
    },
    enumerateAccounts(state, action: PayloadAction<void>) {
      state.step = undefined
      state.accounts = []
    },
    toggleAccount(state, action: PayloadAction<number>) {
      const index = action.payload
      state.accounts[index].selected = !state.accounts[index].selected
    },
    accountsListed(state, action: PayloadAction<LedgerAccount[]>) {
      state.accounts = action.payload
    },
    setStep(state, action: PayloadAction<LedgerStep>) {
      state.step = action.payload
    },
    operationFailed(state, action: PayloadAction<ErrorPayload>) {
      state.error = action.payload
      state.step = undefined
    },
  },
})

export const { actions: ledgerActions } = slice

export default slice.reducer
