import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

import { getScreenPrivacyFromStorage, saveScreenPrivacy } from '../utils'
import { ScreenPrivacyType, SettingsState } from './types'

export const getInitialState = (): SettingsState => ({
  screenPrivacy: getScreenPrivacyFromStorage() || 'on',
})

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: () => getInitialState(),
  reducers: {
    changeScreenPrivacy(state, action: PayloadAction<ScreenPrivacyType>) {
      saveScreenPrivacy(action.payload)
      state.screenPrivacy = action.payload
    },
  },
})

export const { actions: settingsActions } = settingsSlice
