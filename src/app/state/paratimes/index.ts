import { PayloadAction } from '@reduxjs/toolkit'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { ParaTimesState, TransactionForm, TransactionFormSteps, TransactionTypes } from './types'

export const initialState: ParaTimesState = {
  balance: '',
  isLoading: false,
  transactionForm: {
    amount: '',
    confirmation: false,
    feeAmount: '',
    feeGas: '',
    paraTime: undefined,
    privateKey: '',
    recipient: '',
    type: undefined,
  },
  transactionFormStep: TransactionFormSteps.TransferType,
}

const slice = createSlice({
  name: 'paraTimes',
  initialState,
  reducers: {
    balanceLoaded(state, action: PayloadAction<StringifiedBigInt>) {
      state.balance = action.payload
      state.isLoading = false
    },
    fetchBalanceUsingEthPrivateKey(state, action: PayloadAction<void>) {
      state.isLoading = true
    },
    fetchBalanceUsingOasisAddress(state, action: PayloadAction<void>) {
      state.isLoading = true
    },
    resetTransactionForm(state, action: PayloadAction<void>) {
      state.transactionError = undefined
      state.transactionForm = initialState.transactionForm
      state.transactionFormStep = TransactionFormSteps.TransferType
    },
    navigateToDeposit(state, action: PayloadAction<void>) {
      state.transactionForm.type = TransactionTypes.Deposit
      state.transactionFormStep = TransactionFormSteps.ParaTimeSelection
    },
    navigateToWithdraw(state, action: PayloadAction<void>) {
      state.transactionForm.type = TransactionTypes.Withdraw
      state.transactionFormStep = TransactionFormSteps.ParaTimeSelection
    },
    navigateToRecipient(state, action: PayloadAction<void>) {
      state.transactionFormStep = TransactionFormSteps.TransactionRecipient
    },
    navigateToAmount(state, action: PayloadAction<void>) {
      state.transactionFormStep = TransactionFormSteps.TransactionAmount
    },
    navigateToParaTimes(state, action: PayloadAction<void>) {
      state.transactionFormStep = TransactionFormSteps.TransferType
    },
    navigateToConfirmation(state, action: PayloadAction<void>) {
      state.transactionFormStep = TransactionFormSteps.TransactionConfirmation
    },
    navigateToSummary(state, action: PayloadAction<void>) {
      state.transactionFormStep = TransactionFormSteps.TransactionSummary
    },
    setTransactionForm(state, action: PayloadAction<TransactionForm>) {
      state.transactionForm = action.payload
    },
    submitTransaction(state, action: PayloadAction<void>) {
      state.isLoading = true
      state.transactionError = undefined
    },
    transactionError(state, action: PayloadAction<ErrorPayload>) {
      state.isLoading = false
      state.transactionError = action.payload
      state.transactionFormStep = TransactionFormSteps.TransactionError
    },
    transactionSubmitted(state, action: PayloadAction<void>) {
      state.isLoading = false
      state.transactionFormStep = TransactionFormSteps.TransactionSummary
    },
  },
})

export const { actions: paraTimesActions } = slice

export default slice.reducer
