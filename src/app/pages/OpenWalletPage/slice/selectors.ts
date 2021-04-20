import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.openWallet || initialState

export const selectOpenWallet = createSelector([selectSlice], state => state)
