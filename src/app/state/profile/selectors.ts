import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.profile || initialState

export const selectProfile = createSelector([selectSlice], state => state)
