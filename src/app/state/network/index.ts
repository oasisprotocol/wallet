import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { NetworkState, NetworkType } from './types'

export const initialState: NetworkState = {
  ticker: '',
  chainContext: '',
  selectedNetwork: !process.env.REACT_APP_BYPASS_LOCAL ? 'local' : 'mainnet',
  epoch: 0,
  minimumStakingAmount: 0,
}

const slice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    selectNetwork(state, action: PayloadAction<NetworkType>) {},
    networkSelected(state, action: PayloadAction<NetworkState>) {
      Object.assign(state, action.payload)
    },
  },
})

export const { actions: networkActions } = slice

export default slice.reducer
