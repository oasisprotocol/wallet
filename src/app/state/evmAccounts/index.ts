import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { EvmAccounts } from './types'

export const initialState: EvmAccounts = {}

const slice = createSlice({
  name: 'evmAccounts',
  initialState,
  reducers: {
  },
})

export const { actions: evmAccountsActions } = slice

export default slice.reducer
