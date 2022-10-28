import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

import {
  AddWalletPayload,
  BalanceUpdatePayload,
  OpenFromPrivateKeyPayload,
  OpenSelectedAccountsPayload,
  Wallet,
  WalletState,
} from './types'

export const initialState: WalletState = {
  wallets: {},
  isOpen: false,
  selectedWallet: undefined,
}

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    openWalletFromMnemonic(state, action: PayloadAction<OpenSelectedAccountsPayload>) {},
    openWalletFromPrivateKey(state, action: PayloadAction<OpenFromPrivateKeyPayload>) {},
    openWalletsFromLedger(state, action: PayloadAction<OpenSelectedAccountsPayload>) {},
    selectWallet(state, action: PayloadAction<string | undefined>) {
      state.selectedWallet = action.payload
    },
    fetchWallet(state, action: PayloadAction<Wallet>) {},
    updateBalance(state, action: PayloadAction<BalanceUpdatePayload>) {
      Object.assign(state.wallets[action.payload.address].balance, action.payload.balance)
    },
    addWallet(state, action: PayloadAction<AddWalletPayload>) {},
    walletOpened(state, action: PayloadAction<Wallet>) {
      const newWallet = action.payload
      state.wallets[newWallet.address] = newWallet
      state.selectedWallet ??= newWallet.address
      state.isOpen = true
    },
  },
})

export const { actions: walletActions } = slice

export default slice.reducer
