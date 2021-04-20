import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { useInjectReducer } from 'utils/redux-injectors'
import { OpenWalletState } from './types'

export const initialState: OpenWalletState = {}

const slice = createSlice({
  name: 'openWallet',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
})

export const { actions: openWalletActions } = slice

export const useOpenWalletSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer })
  return { actions: slice.actions }
}

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useOpenWalletSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
