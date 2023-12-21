/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { AnyAction, combineReducers } from '@reduxjs/toolkit'
import { persistActions, receivePersistedRootState } from 'app/state/persist'
import { RootState } from 'types'
import { rootSlices } from './slices'

function createRootReducer() {
  const reducers = Object.fromEntries(
    Object.entries(rootSlices).map(([key, slice]) => [key, slice.reducer]),
  ) as {
    [K in keyof typeof rootSlices]: (typeof rootSlices)[K]['reducer']
  }
  const rootReducer = combineReducers(reducers)
  return rootReducer
}

export function createPersistedRootReducer() {
  const originalRootReducer = createRootReducer()
  return (state: RootState | undefined, action: AnyAction): RootState => {
    const newState = originalRootReducer(state, action)
    if (persistActions.setUnlockedRootState.match(action)) {
      return receivePersistedRootState(
        newState,
        action.payload.persistedRootState,
        action.payload.stringifiedEncryptionKey,
      )
    }
    if (persistActions.resetRootState.match(action)) {
      return originalRootReducer(undefined, action)
    }
    return newState
  }
}
