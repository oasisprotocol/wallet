import { PayloadAction } from '@reduxjs/toolkit'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { ImportAccountsListAccount, ImportAccountsState, ImportAccountsStep } from './types'

export const initialState: ImportAccountsState = { accounts: [], showAccountsSelectionModal: false }

const slice = createSlice({
  name: 'importAccounts',
  initialState,
  reducers: {
    clear(state, action: PayloadAction<void>) {
      state.accounts = []
      state.error = undefined
      state.step = undefined
      state.showAccountsSelectionModal = false
    },
    enumerateAccountsFromLedger(state, action: PayloadAction<void>) {
      state.step = undefined
      state.accounts = []
      state.showAccountsSelectionModal = true
    },
    enumerateAccountsFromMnemonic(state, action: PayloadAction<string>) {
      state.step = undefined
      state.accounts = []
      state.showAccountsSelectionModal = true
    },
    toggleAccount(state, action: PayloadAction<number>) {
      const index = action.payload
      state.accounts[index].selected = !state.accounts[index].selected
    },
    accountsListed(state, action: PayloadAction<ImportAccountsListAccount[]>) {
      state.accounts = action.payload
    },
    setStep(state, action: PayloadAction<ImportAccountsStep>) {
      state.step = action.payload
    },
    operationFailed(state, action: PayloadAction<ErrorPayload>) {
      state.error = action.payload
      state.step = undefined
    },
  },
})

export const { actions: importAccountsActions } = slice

export default slice.reducer
