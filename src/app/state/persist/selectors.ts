import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { getInitialState } from '.'

const selectSlice = (state: RootState) => state.persist || getInitialState()

export const selectLoading = createSelector([selectSlice], state => state.loading)
export const selectEnteredWrongPassword = createSelector([selectSlice], state => state.enteredWrongPassword)
export const selectNeedsPassword = createSelector(
  [selectSlice],
  state => state.isPersisted && !state.stringifiedEncryptionKey,
)
export const selectIsPersisted = createSelector([selectSlice], state => state.isPersisted)
export const selectIsPersistenceUnsupported = createSelector(
  [selectSlice],
  state => state.isPersistenceUnsupported,
)
