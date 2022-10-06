import { createSelector } from '@reduxjs/toolkit'
import { selectSlice as selectPersistSlice } from 'app/state/persist/selectors'
import { selectIsOpen } from 'app/state/wallet/selectors'

export const selectIsLockableOrCloseable = createSelector(
  [selectPersistSlice, selectIsOpen],
  (state, isOpen) => {
    if (state.hasPersistedProfiles) {
      if (state.stringifiedEncryptionKey === 'skipped') return 'closeable'
      if (state.stringifiedEncryptionKey) return 'lockable'
    } else {
      if (isOpen) return 'closeable'
    }
    return false
  },
)
