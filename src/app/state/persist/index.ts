import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { PersistState } from './types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createPersistedRootReducer } from 'store/reducers'
import { RootState } from 'types'

export const STORAGE_FIELD = 'oasis_wallet_persist_v1'

export function getInitialState(): PersistState {
  return {
    hasPersistedProfiles: !!localStorage.getItem(STORAGE_FIELD),
    loading: false,
    stringifiedEncryptionKey: undefined,
    enteredWrongPassword: false,
  }
}

const persistSlice = createSlice({
  name: 'persist',
  initialState: getInitialState(),
  reducers: {
    setWrongPassword(state) {
      state.enteredWrongPassword = true
      state.loading = false
    },
    setUnlockedRootState(state, action: PayloadAction<{ rootState: RootState }>) {
      /**
       * Handled in {@link createPersistedRootReducer}.
       * Sets `state.loading = false` and `state.stringifiedEncryptionKey`.
       */
      return
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
    eraseAsync(state) {
      state.loading = true
    },
  },
})

export const persistActions = persistSlice.actions

export default persistSlice.reducer
