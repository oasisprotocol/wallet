import { PayloadAction } from '@reduxjs/toolkit'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { ImportAccountsListAccount, ImportAccountsState, ImportAccountsStep } from './types'

export const initialState: ImportAccountsState = {
  accounts: [],
  showAccountsSelectionModal: false,
  step: ImportAccountsStep.Idle,
}

const slice = createSlice({
  name: 'importAccounts',
  initialState,
  reducers: {
    clear(state) {
      state.accounts = []
      state.error = undefined
      state.step = ImportAccountsStep.Idle
      state.showAccountsSelectionModal = false
    },
    enumerateAccountsFromLedger(state) {
      state.accounts = []
      state.showAccountsSelectionModal = true
      state.step = ImportAccountsStep.Idle
    },
    enumerateAccountsFromMnemonic(state, _action: PayloadAction<string>) {
      state.step = ImportAccountsStep.Idle
      state.accounts = []
      state.showAccountsSelectionModal = true
    },
    toggleAccount(state, action: PayloadAction<string>) {
      const account = state.accounts.find(a => a.address === action.payload)!
      account.selected = !account.selected
    },
    accountGenerated(state, action: PayloadAction<ImportAccountsListAccount>) {
      state.accounts.push(action.payload)
    },
    accountsListed(state, action: PayloadAction<ImportAccountsListAccount[]>) {
      state.accounts = action.payload
    },
    updateAccountBalance(
      state,
      action: PayloadAction<Pick<ImportAccountsListAccount, 'address' | 'balance'>>,
    ) {
      const { address, balance } = action.payload
      const account = state.accounts.find(a => a.address === address)
      if (account) account.balance = balance
    },
    setStep(state, action: PayloadAction<ImportAccountsStep>) {
      state.step = action.payload
    },
    operationFailed(state, action: PayloadAction<ErrorPayload>) {
      state.error = action.payload
      state.step = ImportAccountsStep.Idle
    },
  },
})

export const { actions: importAccountsActions } = slice

export default slice.reducer
