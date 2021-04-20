import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors'
import { networkSaga } from './saga'
import { NetworkState } from './types'

export const initialState: NetworkState = {
  ticker: 'TEST',
}

const slice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
})

export const { actions: networkActions } = slice

export const useNetworkSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer })
  useInjectSaga({ key: slice.name, saga: networkSaga })
  return { actions: slice.actions }
}

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useNetworkSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
