import { createSelector } from '@reduxjs/toolkit'
import { selectSlice as selectPersistSlice } from 'app/state/persist/selectors'
import { selectHasAccounts } from 'app/state/wallet/selectors'

export const selectUnlockedStatus = createSelector(
  [selectPersistSlice, selectHasAccounts],
  (state, hasAccounts) => {
    if (state.hasPersistedProfiles) {
      if (state.stringifiedEncryptionKey === 'skipped') {
        if (hasAccounts) return 'openSkippedUnlockingProfile'
        return 'emptySkippedUnlockingProfile'
      }
      if (state.stringifiedEncryptionKey) return 'unlockedProfile'
      return 'lockedProfile'
    } else {
      if (hasAccounts) return 'openUnpersisted'
      return 'emptyUnpersisted'
    }
  },
)
