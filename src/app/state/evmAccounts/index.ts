import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { EvmAccounts } from './types'
import { privateToEthAddress } from '../../lib/eth-helpers'

export const initialState: EvmAccounts = {}

export const evmAccountsSlice = createSlice({
  name: 'evmAccounts',
  initialState,
  reducers: {
    add(state, action: PayloadAction<{ ethPrivateKey: string }>) {
      const ethAddress = privateToEthAddress(action.payload.ethPrivateKey)
      state[ethAddress] = {
        ethPrivateKey: action.payload.ethPrivateKey,
        ethAddress: ethAddress,
      }
    },
    delete(state, action: PayloadAction<{ ethAddress: string }>) {
      delete state[action.payload.ethAddress]
    },
  },
})

export const { actions: evmAccountsActions } = evmAccountsSlice
