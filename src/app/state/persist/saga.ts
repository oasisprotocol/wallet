import { AnyAction } from '@reduxjs/toolkit'
import { call, fork, put, select, take } from 'typed-redux-saga'
import { persistActions, getInitialState, STORAGE_FIELD } from './index'
import {
  base64andStringify,
  decryptWithPassword,
  deriveKeyFromPassword,
  encryptWithKey,
  fromBase64andParse,
} from './encryption'
import { RootState } from 'types'
import { EncryptedString, KeyWithSalt, RootStateWithoutPersistSlice } from './types'
import { PasswordWrongError } from 'types/errors'

function* watchPersistAsync() {
  yield* fork(function* () {
    while (true) {
      const action: AnyAction = yield* take('*')
      // Make queue of async operations, without forking, to avoid race
      // conditions (e.g. multiple writes to localStorage in wrong order).
      // Problems with queue:
      // - select() returns latest state instead of state when action was dispatched.
      //   I think that still works correctly.
      yield* call(handleAsyncPersistActions, action)
    }
  })
}

function* handleAsyncPersistActions(action: AnyAction) {
  if (persistActions.setPasswordAsync.match(action)) {
    yield* call(setPasswordAsync, action)
  } else if (persistActions.unlockAsync.match(action)) {
    yield* call(unlockAsync, action)
  } else if (persistActions.lockAsync.match(action)) {
    yield* call(lockAsync, action)
  } else if (persistActions.eraseAsync.match(action)) {
    yield* call(eraseAsync, action)
  } else if (persistActions.setUnlockedRootState.match(action)) {
    // Skip encrypting the same state
  } else if (persistActions.setWrongPassword.match(action)) {
    // Skip encrypting the same state
  } else {
    // Encrypt after other actions

    yield* call(encryptAndPersistState, action)
  }
}

// Handlers
function* setPasswordAsync(action: ReturnType<typeof persistActions.setPasswordAsync>) {
  /**
   * Latest state does not match state immediately after action was dispatched,
   * but when it is queued by {@link watchPersistAsync}.
   */
  const latestState: RootState = yield* select()
  if (latestState.persist.isPersistenceUnsupported) throw new Error('Persistence not supported')
  const keyWithSalt = yield* call(deriveKeyFromPassword, action.payload.password)
  const encryptedState = yield* call(encryptState, latestState, keyWithSalt)
  window.localStorage.setItem(STORAGE_FIELD, encryptedState)
  const decryptedState = yield* call(
    decryptState,
    window.localStorage.getItem(STORAGE_FIELD)!,
    action.payload.password,
  )
  yield* put(persistActions.setUnlockedRootState({ rootState: decryptedState }))
}

function* unlockAsync(action: ReturnType<typeof persistActions.unlockAsync>) {
  const encryptedState: EncryptedString | null = window.localStorage.getItem(STORAGE_FIELD)
  if (!encryptedState) throw new Error('Unexpected unlock action while no state is locked')
  try {
    const decryptedState = yield* call(decryptState, encryptedState, action.payload.password)
    yield* put(persistActions.setUnlockedRootState({ rootState: decryptedState }))
  } catch (error) {
    if (error instanceof PasswordWrongError) {
      yield* put(persistActions.setWrongPassword())
    } else {
      throw error
    }
  }
}

function* lockAsync(action: ReturnType<typeof persistActions.lockAsync>) {
  yield* call([window.location, window.location.reload])
  // Implies state.loading = false
}

function* eraseAsync(action: ReturnType<typeof persistActions.eraseAsync>) {
  yield* call([window.localStorage, window.localStorage.removeItem], STORAGE_FIELD)
  yield* call([window.location, window.location.reload])
  // Implies state.loading = false
}

// Encrypting
async function encryptState(state: RootState, keyWithSalt: KeyWithSalt): Promise<EncryptedString> {
  const stateWithoutEncryptSlice: RootStateWithoutPersistSlice = {
    ...state,
    persist: null,
  }
  const encryptedState = await encryptWithKey(keyWithSalt, stateWithoutEncryptSlice)
  return encryptedState
}

async function decryptState(encryptedState: EncryptedString, password: string): Promise<RootState> {
  const stateWithoutEncryptSlice: RootStateWithoutPersistSlice = await decryptWithPassword(
    password,
    encryptedState,
  )
  const keyWithSalt = await deriveKeyFromPassword(password)
  const stateWithEncryptSlice: RootState = {
    ...stateWithoutEncryptSlice,
    persist: {
      ...getInitialState(),
      stringifiedEncryptionKey: base64andStringify(keyWithSalt),
    },
  }
  return stateWithEncryptSlice
}

function* encryptAndPersistState(action: AnyAction) {
  /**
   * Latest state does not match state immediately after action was dispatched,
   * but when it is queued by {@link watchPersistAsync}.
   */
  const latestState: RootState = yield* select()
  if (!latestState.persist.hasPersistedProfiles) return
  if (action.type.startsWith('@')) return // Ignore @@INIT from redux-devtools-instrument
  if (!latestState.persist.stringifiedEncryptionKey) {
    throw new Error(`Unexpected action while state is locked ${JSON.stringify(action)}`)
  }
  const keyWithSalt: KeyWithSalt = fromBase64andParse(latestState.persist.stringifiedEncryptionKey)
  const encryptedState = yield* call(encryptState, latestState, keyWithSalt)
  window.localStorage.setItem(STORAGE_FIELD, encryptedState)
}

export function* persistSaga() {
  yield* watchPersistAsync()
}
