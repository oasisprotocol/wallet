import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { FatalErrorPayload, FatalErrorState } from './types'

export const initialState: FatalErrorState = {}

const slice = createSlice({
  name: 'fatalError',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<FatalErrorPayload>) {
      if (!state.error) {
        state.error = action.payload
      }
    },
  },
})

export const { actions: fatalErrorActions } = slice

export default slice.reducer
