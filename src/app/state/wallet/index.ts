import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

import {
  BalanceUpdatePayload,
  OpenFromPrivateKeyPayload,
  OpenSelectedAccountsPayload,
  Wallet,
  WalletState,
} from './types'

export const initialState: WalletState = {
  wallets: {},
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
      // We simply ignore the updateBalance action in rare cases when opening a
      // second tab while account is loading:
      // - tab2 initializes
      // - tab1 dispatches updateBalance
      // - tab2 asks to sync state
      // - tab2 receives updateBalance for an account it doesn't have
      // - tab1 responds with state
      // - tab2 receives synced state with the account it didn't have
      //
      // Alternatives:
      // - Remove updateBalance from whitelistTabSyncActions and have an
      //   outdated balance in case tab2 makes a transaction.
      // - Refactor redux-state-sync to ignore actions until tab2 receives
      //   synced state. But tab1 needs to listen to actions too, even tho it
      //   never asks for synced state.
      if (state.wallets[action.payload.address]?.balance) {
        Object.assign(state.wallets[action.payload.address].balance, action.payload.balance)
      }
    },
    walletOpened(state, action: PayloadAction<Wallet>) {
      const newWallet = action.payload
      state.wallets[newWallet.address] = newWallet
      state.selectedWallet ??= newWallet.address
    },
    setWalletName(state, action: PayloadAction<{ address: string; name: string }>) {
      state.wallets[action.payload.address].name = action.payload.name
    },
  },
})

export const { actions: walletActions } = slice

export default slice.reducer
