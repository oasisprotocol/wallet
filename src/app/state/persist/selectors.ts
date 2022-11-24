import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { getInitialState } from '.'

export const selectSlice = (state: RootState) => state.persist || getInitialState()

export const selectLoading = createSelector([selectSlice], state => state.loading)
export const selectEnteredWrongPassword = createSelector([selectSlice], state => state.enteredWrongPassword)
export const selectNeedsPassword = createSelector(
  [selectSlice],
  state => state.hasPersistedProfiles && !state.stringifiedEncryptionKey,
)
export const selectSkipUnlockingOnInit = createSelector(
  [selectSlice],
  state => !state.hasPersistedProfiles && !state.stringifiedEncryptionKey,
)
export const selectHasPersistedProfiles = createSelector([selectSlice], state => state.hasPersistedProfiles)
export const selectIsPersistenceUnsupported = createSelector(
  [selectSlice],
  state => state.isPersistenceUnsupported,
)
