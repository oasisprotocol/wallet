import { PayloadAction } from '@reduxjs/toolkit'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors'
import { rootWalletSaga } from './saga'
import { SendTransactionPayload, TransactionSent, Wallet, WalletBalance, WalletState } from './types'

export const initialState: WalletState = {
  isOpen: false,
  address: '',
  publicKey: '',
  privateKey: undefined,
  type: undefined,
  balance: {
    available: '0',
    escrow: '0',
    debonding: '0',
  },
  transaction: { success: false, isSending: false },
}

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    loadWallet(state, action: PayloadAction<void>) {},
    openWalletFromMnemonic(state, action: PayloadAction<string>) {},
    openWalletFromPrivateKey(state, action: PayloadAction<string>) {},
    clearTransaction(state, action: PayloadAction<void>) {
      state.transaction.error = undefined
      state.transaction.success = false
    },
    sendTransaction(state, action: PayloadAction<SendTransactionPayload>) {
      state.transaction.error = undefined
      state.transaction.success = false
      state.transaction.isSending = true
    },
    transactionSent(state, action: PayloadAction<TransactionSent>) {
      state.transaction.success = true
      state.transaction.isSending = false
    },
    transactionFailed(state, action: PayloadAction<ErrorPayload>) {
      state.transaction.error = action.payload
      state.transaction.isSending = false
    },
    closeWallet(state, action: PayloadAction<void>) {},
    walletOpened(state, action: PayloadAction<Wallet>) {
      Object.assign(state, { ...action.payload, isOpen: true })
    },
    walletClosed(state, action: PayloadAction<void>) {
      // Revert to initial state
      Object.assign(state, initialState)
    },
    walletLoaded(state, action: PayloadAction<WalletBalance>) {
      state.isOpen = true
      state.balance = action.payload
    },
  },
})

export const { actions: walletActions } = slice

export const useWalletSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer })
  useInjectSaga({ key: slice.name, saga: rootWalletSaga })
  return { actions: slice.actions }
}

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useWalletSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
