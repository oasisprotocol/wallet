import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

import { getThemeFromStorage, saveTheme } from '../utils'
import { ThemeState } from './types'

export const getInitialState = (): ThemeState => ({
  selected: getThemeFromStorage() || 'system',
})

export const themeSlice = createSlice({
  name: 'theme',
  initialState: () => getInitialState(),
  reducers: {
    changeTheme(state, action: PayloadAction<'dark' | 'light' | 'system'>) {
      saveTheme(action.payload)
      state.selected = action.payload
    },
  },
})

export const { actions: themeActions } = themeSlice
