import { PayloadAction } from '@reduxjs/toolkit'
import { Transaction } from 'app/state/transaction/types'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { AccountState, Account } from './types'

export const initialState: AccountState = {
  address: '',
  available: null,
  debonding: null,
  delegations: null,
  total: null,

  accountError: undefined,
  transactions: [],
  transactionsError: undefined,
  loading: true,
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    openAccountPage(state, action: PayloadAction<string>) {},
    closeAccountPage(state) {},
    clearAccount(state, action: PayloadAction<void>) {
      Object.assign(state, initialState)
    },
    fetchAccount(state, action: PayloadAction<string>) {},
    accountLoaded(state, action: PayloadAction<Account>) {
      state.accountError = undefined
      Object.assign(state, action.payload)
    },
    accountError(state, action: PayloadAction<ErrorPayload>) {
      state.accountError = action.payload
    },
    transactionsLoaded(state, action: PayloadAction<Transaction[]>) {
      state.transactionsError = undefined
      state.transactions = action.payload
    },
    transactionsError(state, action: PayloadAction<ErrorPayload>) {
      state.transactionsError = action.payload
      // TODO: keep old state if loading the same account
      state.transactions = []
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const { actions: accountActions } = accountSlice
