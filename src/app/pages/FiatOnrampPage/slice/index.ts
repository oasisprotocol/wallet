import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { FiatOnrampState } from './types'

export const initialState: FiatOnrampState = {
  thirdPartyAcknowledged: false,
}

export const fiatOnrampSlice = createSlice({
  name: 'fiatOnramp',
  initialState,
  reducers: {
    setThirdPartyAcknowledged(state, action: PayloadAction<boolean>) {
      state.thirdPartyAcknowledged = action.payload
    },
  },
})

export const { actions: fiatOnrampActions } = fiatOnrampSlice
