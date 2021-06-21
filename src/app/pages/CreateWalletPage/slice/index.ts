import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { hdkey } from '@oasisprotocol/client'
import { useInjectReducer } from 'utils/redux-injectors'
import { CreateWalletState } from './types'

export const initialState: CreateWalletState = {
  checkbox: false,
  mnemonic: [],
}

const slice = createSlice({
  name: 'createWallet',
  initialState,
  reducers: {
    /**
     * Generate a new mnemonic
     */
    generateMnemonic(state, action: PayloadAction<void>) {
      state.mnemonic = hdkey.HDKey.generateMnemonic(256).split(' ')
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

export const { actions: createWalletActions } = slice

export const useCreateWalletSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer })
  return { actions: slice.actions }
}

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useCreateWalletSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
