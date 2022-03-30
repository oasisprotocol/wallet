import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { OpenWalletState } from './types'

export const initialState: OpenWalletState = {}

const slice = createSlice({
  name: 'openWallet',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
})

export const { actions: openWalletActions } = slice

export default slice.reducer
