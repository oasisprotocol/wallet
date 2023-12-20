import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { FatalErrorPayload, FatalErrorState } from './types'

export const initialState: FatalErrorState = {}

export const fatalErrorSlice = createSlice({
  name: 'fatalError',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<FatalErrorPayload>) {
      state.error ??= action.payload
    },
  },
})

export const { actions: fatalErrorActions } = fatalErrorSlice
