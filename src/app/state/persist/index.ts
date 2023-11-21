import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import {
  PersistedRootState,
  PersistState,
  SetUnlockedRootStatePayload,
  StringifiedKeyWithSalt,
  UpdatePasswordPayload,
} from './types'
import { RootState } from 'types'
import { runtimeIs } from 'config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createPersistedRootReducer } from 'store/reducers'

export const STORAGE_FIELD = 'oasis_wallet_persist_v1'

/** Syncing tabs is only needed in web app, not in extension. */
export const needsSyncingTabs = runtimeIs === 'webapp'

// Simulate with `delete window.BroadcastChannel`
export const isSyncingTabsSupported = typeof BroadcastChannel === 'function'

export function getInitialState(): PersistState {
  return {
    hasPersistedProfiles: !!window.localStorage.getItem(STORAGE_FIELD),
    hasV0StorageToMigrate: false,
    // Disable persistence if tabs would override each other.
    isPersistenceUnsupported: needsSyncingTabs && !isSyncingTabsSupported,
    loading: false,
    stringifiedEncryptionKey: localStorage.getItem(STORAGE_FIELD) ? undefined : 'skipped',
    enteredWrongPassword: false,
  }
}

const persistSlice = createSlice({
  name: 'persist',
  initialState: () => getInitialState(),
  reducers: {
    setWrongPassword(state) {
      state.enteredWrongPassword = true
      state.loading = false
    },
    resetWrongPassword(state) {
      state.enteredWrongPassword = false
    },
    setUnlockedRootState(state, action: PayloadAction<SetUnlockedRootStatePayload>) {
      /**
       * Handled in {@link createPersistedRootReducer} and {@link receivePersistedRootState}.
       * Sets `state.loading = false` and `state.stringifiedEncryptionKey`.
       */
      return
    },
    resetRootState(state) {
      /**
       * Handled in {@link createPersistedRootReducer}.
       * Sets `state.loading = false`.
       */
      return
    },
    skipUnlocking(state) {
      state.stringifiedEncryptionKey = 'skipped'
    },
    setHasV0StorageToMigrate(state, action: PayloadAction<boolean>) {
      state.hasV0StorageToMigrate = action.payload
    },

    // Handled in saga
    // ---------------
    /**
     * Set a password to encrypt state with and begin storing it to localStorage.
     */
    setPasswordAsync(state, action: PayloadAction<{ password: string }>) {
      state.loading = true
    },
    /**
     * Load encrypted state from localStorage and decrypt, or set {@link PersistState.enteredWrongPassword}.
     */
    unlockAsync(state, action: PayloadAction<{ password: string }>) {
      state.loading = true
    },
    /**
     * Remove everything from state, especially {@link PersistState.stringifiedEncryptionKey}.
     * UnlockGate should stop any components relying on missing state.
     */
    lockAsync(state) {
      state.loading = true
    },
    /**
     * Remove encrypted state from localStorage and reload.
     */
    deleteProfileAsync(state) {
      state.loading = true
    },
    updatePasswordAsync(state, action: PayloadAction<UpdatePasswordPayload>) {
      return
    },
  },
})

export const persistActions = persistSlice.actions

export default persistSlice.reducer

/**
 * When persisted state is unlocked use these state slices.
 */
export function receivePersistedRootState(
  prevState: RootState,
  persistedRootState: PersistedRootState,
  stringifiedEncryptionKey: StringifiedKeyWithSalt,
): RootState {
  return {
    ...prevState,
    contacts: persistedRootState.contacts,
    evmAccounts: persistedRootState.evmAccounts,
    theme: persistedRootState.theme,
    wallet: persistedRootState.wallet,
    network: persistedRootState.network,
    persist: {
      ...getInitialState(),
      stringifiedEncryptionKey: stringifiedEncryptionKey,
    },
  }
}
