import { createSelector } from '@reduxjs/toolkit'
import { selectUnlockedStatus } from 'app/state/selectUnlockedStatus'
import { ExhaustedTypeError } from 'types/errors'

export const selectIsLockableOrCloseable = createSelector([selectUnlockedStatus], unlockedStatus => {
  if (unlockedStatus === 'skippedUnlockingProfile') return 'closeable'
  if (unlockedStatus === 'unlockedProfile') return 'lockable'
  if (unlockedStatus === 'openUnpersisted') return 'closeable'
  if (unlockedStatus === 'lockedProfile') return false
  if (unlockedStatus === 'emptyUnpersisted') return false
  throw new ExhaustedTypeError('Invalid unlocked status', unlockedStatus)
})
