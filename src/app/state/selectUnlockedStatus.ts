import { createSelector } from '@reduxjs/toolkit'
import { selectSlice as selectPersistSlice } from 'app/state/persist/selectors'
import { selectIsOpen } from 'app/state/wallet/selectors'

export const selectUnlockedStatus = createSelector([selectPersistSlice, selectIsOpen], (state, isOpen) => {
  if (state.hasPersistedProfiles) {
    if (state.stringifiedEncryptionKey === 'skipped') {
      if (isOpen) return 'openSkippedUnlockingProfile'
      return 'emptySkippedUnlockingProfile'
    }
    if (state.stringifiedEncryptionKey) return 'unlockedProfile'
    return 'lockedProfile'
  } else {
    if (isOpen) return 'openUnpersisted'
    return 'emptyUnpersisted'
  }
})
