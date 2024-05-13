import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { getInitialState } from '.'

const selectSlice = (state: RootState) => state.theme || getInitialState()
export const selectTheme = createSelector([selectSlice], theme => theme.selected)
