import { AnyAction } from '@reduxjs/toolkit'
import { actionChannel, call, fork, put, select, take } from 'typed-redux-saga'
import { isActionSynced } from 'redux-state-sync'
import { persistActions, STORAGE_FIELD } from './index'
import {
  base64andStringify,
  decryptWithPassword,
  deriveKeyFromPassword,
  encryptWithKey,
  fromBase64andParse,
} from './encryption'
import { RootState } from 'types'
import { EncryptedString, KeyWithSalt, PersistedRootState, SetUnlockedRootStatePayload } from './types'
import { PasswordWrongError } from 'types/errors'
import { walletActions } from 'app/state/wallet'
import { selectUnlockedStatus } from 'app/state/selectUnlockedStatus'
import { runtimeIs } from 'config'

function* watchPersistAsync() {
  yield* fork(function* () {
    const channelQueue = yield* actionChannel<AnyAction>('*')
    while (true) {
      // TODO: could flush(channelQueue) to speedup multiple consecutive writes
      const action: AnyAction = yield* take(channelQueue)
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
  } else if (persistActions.resetRootState.match(action)) {
    // Skip encrypting the empty state
    yield* call(resetRootState, action)
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
  const unlockedPayload = yield* call(
    decryptState,
    window.localStorage.getItem(STORAGE_FIELD)!,
    action.payload.password,
  )
  yield* put(persistActions.setUnlockedRootState(unlockedPayload))
}

function* unlockAsync(action: ReturnType<typeof persistActions.unlockAsync>) {
  const encryptedState: EncryptedString | null = window.localStorage.getItem(STORAGE_FIELD)
  if (!encryptedState) throw new Error('Unexpected unlock action while no state is locked')
  try {
    const unlockedPayload = yield* call(decryptState, encryptedState, action.payload.password)
    yield* put(persistActions.setUnlockedRootState(unlockedPayload))
  } catch (error) {
    if (error instanceof PasswordWrongError) {
      yield* put(persistActions.setWrongPassword())
    } else {
      throw error
    }
  }
}

function* lockAsync(action: ReturnType<typeof persistActions.lockAsync>) {
  yield* put(persistActions.resetRootState())
  // Implies state.loading = false
}

function* eraseAsync(action: ReturnType<typeof persistActions.eraseAsync>) {
  yield* call([window.localStorage, window.localStorage.removeItem], STORAGE_FIELD)
  yield* put(persistActions.resetRootState())
  // Implies state.loading = false
}

function* resetRootState(action: ReturnType<typeof persistActions.resetRootState>) {
  const unlockedStatus = yield* select(selectUnlockedStatus)
  // Redirect home to prevent infinite loading if user closes unpersisted wallet in another tab.
  if (isActionSynced(action) && unlockedStatus === 'emptyUnpersisted') {
    // Note: can only redirect in webapp, because saga runs in background page in extension.
    // TODO: find another way if extension starts supporting multiple popups or tabs
    // e.g. show "You closed wallet in another tab, click to go home"
    if (runtimeIs === 'webapp') {
      yield* call([window.location, window.location.assign], '/')
    }
  }
}

// Encrypting
async function encryptState(state: RootState, keyWithSalt: KeyWithSalt): Promise<EncryptedString> {
  const persistedRootState: PersistedRootState = {
    theme: state.theme,
    wallet: state.wallet,
    network: state.network,
  }
  const encryptedState = await encryptWithKey(keyWithSalt, persistedRootState)
  return encryptedState
}

async function decryptState(
  encryptedState: EncryptedString,
  password: string,
): Promise<SetUnlockedRootStatePayload> {
  const persistedRootState: PersistedRootState = await decryptWithPassword(password, encryptedState)
  const keyWithSalt = await deriveKeyFromPassword(password)
  const stringifiedEncryptionKey = base64andStringify(keyWithSalt)
  return { persistedRootState, stringifiedEncryptionKey }
}

function* encryptAndPersistState(action: AnyAction) {
  /**
   * Latest state does not match state immediately after action was dispatched,
   * but when it is queued by {@link watchPersistAsync}.
   */
  const latestState: RootState = yield* select()
  if (latestState.persist.stringifiedEncryptionKey === 'skipped') return
  if (action.type.startsWith('@')) return // Ignore @@INIT from redux-devtools-instrument
  if (action.type.startsWith('&')) return // Ignore e.g. &_GET_INIT_STATE from redux-state-sync
  if (isActionSynced(action)) return // Ignore actions synced across tabs from redux-state-sync

  // Handle actions while state is locked
  // TODO: If we used private/public key-pair we could encrypt and persist
  // state while state is locked. But not if we support multiple profiles.
  if (!latestState.persist.stringifiedEncryptionKey) {
    if (walletActions.walletOpened.match(action)) {
      throw new Error('Could not add account while state is locked.')
    } else {
      return // Ignore non-essential actions emitted while state is locked.
    }
  }

  const keyWithSalt: KeyWithSalt = fromBase64andParse(latestState.persist.stringifiedEncryptionKey)
  const encryptedState = yield* call(encryptState, latestState, keyWithSalt)
  window.localStorage.setItem(STORAGE_FIELD, encryptedState)
}

export function* persistSaga() {
  yield* watchPersistAsync()
}
