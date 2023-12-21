import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { hdkey } from '@oasisprotocol/client'
import { validateMnemonic } from 'bip39'
import { CreateWalletState } from './types'

export const initialState: CreateWalletState = {
  checkbox: false,
  mnemonic: [],
}

export const createWalletSlice = createSlice({
  name: 'createWallet',
  initialState,
  reducers: {
    /**
     * Generate a new mnemonic
     */
    generateMnemonic(state, action: PayloadAction<void>) {
      state.mnemonic = hdkey.HDKey.generateMnemonic(256).split(' ')

      // Verify there's no drift between HDKey.generateMnemonic and bip39
      if (!validateMnemonic(state.mnemonic.join(' '))) {
        throw new Error('Generated mnemonic is not valid')
      }
      state.checkbox = false
    },
    setChecked(state, action: PayloadAction<boolean>) {
      state.checkbox = action.payload
    },
    clear(state, action: PayloadAction<void>) {
      state.mnemonic = []
      state.checkbox = false
    },
  },
})

export const { actions: createWalletActions } = createWalletSlice
