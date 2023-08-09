import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.fiatOnramp || initialState

export const selectFiatOnramp = createSelector([selectSlice], state => state)
