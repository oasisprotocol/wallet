import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

import { getThemeFromStorage, saveTheme } from '../utils'
import { ThemeState } from './types'

export const initialState: ThemeState = {
  selected: getThemeFromStorage() || 'system',
}

const slice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<'dark' | 'light'>) {
      saveTheme(action.payload)
      state.selected = action.payload
    },
  },
})

export const { actions: themeActions } = slice

export default slice.reducer
