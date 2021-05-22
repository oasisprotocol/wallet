import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.fatalError || initialState

export const selectFatalError = createSelector([selectSlice], state => state.error)
