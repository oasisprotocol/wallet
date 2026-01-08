import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { getInitialState } from '.'

const selectSlice = (state: RootState) => state.settings || getInitialState()
export const selectScreenPrivacy = createSelector([selectSlice], settings => settings.screenPrivacy)
export const selectUpdateGateCheck = createSelector([selectSlice], settings => settings.updateGateCheck)
