import { createSlice } from 'utils/@reduxjs/toolkit'
import { FiatOnrampState } from './types'

export const initialState: FiatOnrampState = {
}

const slice = createSlice({
  name: 'fiatOnramp',
  initialState,
  reducers: {
  },
})

export const { actions: fiatOnrampActions } = slice

export default slice.reducer
