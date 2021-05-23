import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { useInjectReducer } from 'utils/redux-injectors'
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

export const useFatalErrorSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer })
  return { actions: slice.actions }
}
