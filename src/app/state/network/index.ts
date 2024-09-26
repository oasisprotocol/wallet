import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { NetworkState, NetworkType } from './types'

export const initialState: NetworkState = {
  ticker: '',
  chainContext: '',
  selectedNetwork: process.env.REACT_APP_LOCALNET ? 'local' : 'mainnet',
  epoch: 0,
  minimumStakingAmount: 0,
}

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    initializeNetwork() {},
    selectNetwork(state, action: PayloadAction<NetworkType>) {
      state.chainContext = initialState.chainContext
    },
    initialNetworkSelected(state, action: PayloadAction<NetworkState>) {
      Object.assign(state, action.payload)
    },
    networkSelected(state, action: PayloadAction<NetworkState>) {
      Object.assign(state, action.payload, { chainContext: initialState.chainContext })
    },
    setChainContext(state, action: PayloadAction<string>) {
      state.chainContext = action.payload
    },
  },
})

export const { actions: networkActions } = networkSlice
