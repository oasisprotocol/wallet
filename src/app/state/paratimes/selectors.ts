import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.paraTimes || initialState

export const selectParaTimes = createSelector([selectSlice], state => state)
