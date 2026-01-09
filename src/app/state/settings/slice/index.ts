import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

import {
  getScreenPrivacyFromStorage,
  getUpdateGateCheckFromStorage,
  saveScreenPrivacy,
  saveUpdateGateCheck,
} from '../utils'
import { UpdateGateCheckType, ScreenPrivacyType, SettingsState } from './types'

export const getInitialState = (): SettingsState => ({
  screenPrivacy: getScreenPrivacyFromStorage() || 'on',
  updateGateCheck: getUpdateGateCheckFromStorage() || 'on',
})

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: () => getInitialState(),
  reducers: {
    changeScreenPrivacy(state, action: PayloadAction<ScreenPrivacyType>) {
      saveScreenPrivacy(action.payload)
      state.screenPrivacy = action.payload
    },
    changeUpdateGateCheck(state, action: PayloadAction<UpdateGateCheckType>) {
      saveUpdateGateCheck(action.payload)
      state.updateGateCheck = action.payload
    },
  },
})

export const { actions: settingsActions } = settingsSlice
