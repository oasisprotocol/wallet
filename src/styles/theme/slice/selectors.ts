import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'
import { isSystemDark } from '../utils'

const selectSlice = (state: RootState) => state.theme || initialState
export const selectTheme = createSelector([selectSlice], theme => {
  if (theme.selected === 'system') {
    return isSystemDark ? 'dark' : 'light'
  }

  return theme.selected
})
