import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { getInitialState } from '.'
import { isSystemDark } from '../utils'

const selectSlice = (state: RootState) => state.theme || getInitialState()
export const selectTheme = createSelector([selectSlice], theme => {
  if (theme.selected === 'system') {
    return isSystemDark ? 'dark' : 'light'
  }

  return theme.selected
})
