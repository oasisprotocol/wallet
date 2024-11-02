import { AnyAction } from '@reduxjs/toolkit'
import { actionChannel, call, fork, put, select, take } from 'typed-redux-saga'
import { isActionSynced } from 'redux-state-sync'
import { persistActions, STORAGE_FIELD } from './index'
import {
  base64andStringify,
  decryptWithKey,
  decryptWithPassword,
  deriveKeyFromPassword,
  encryptWithKey,
  fromBase64andParse,
} from './encryption'
import { RootState } from 'types'
import {
  EncryptedString,
  KeyWithSalt,
  PersistState,
  PersistedRootState,
  SetUnlockedRootStatePayload,
} from './types'
import { PasswordWrongError } from 'types/errors'
import { walletActions } from 'app/state/wallet'
import { selectUnlockedStatus } from 'app/state/selectUnlockedStatus'
import { runtimeIs } from 'config'
import { backupAndDeleteV0ExtProfile, readStorageV0 } from '../../../utils/walletExtensionV0'
import { selectStringifiedEncryptionKey } from './selectors'

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
    yield* call(setPasswordAsync, action.payload.password)
  } else if (persistActions.unlockAsync.match(action)) {
    yield* call(unlockAsync, action)
  } else if (persistActions.lockAsync.match(action)) {
    yield* call(lockAsync, action)
  } else if (persistActions.deleteProfileAsync.match(action)) {
    yield* call(deleteProfileAsync, action)
  } else if (persistActions.updatePasswordAsync.match(action)) {
    yield* call(updatePasswordAsync, action)
  } else if (persistActions.setUnlockedRootState.match(action)) {
    // Skip encrypting the same state
  } else if (persistActions.resetRootState.match(action)) {
    // Skip encrypting the empty state
    yield* call(resetRootState, action)
  } else if (persistActions.setWrongPassword.match(action)) {
    // Skip encrypting the same state
  } else if (persistActions.finishV0Migration.match(action)) {
    yield* call(finishV0Migration, action)
  } else {
    // Encrypt after other actions

    yield* call(encryptAndPersistState, action)
  }
}

// Handlers
function* setPasswordAsync(password: string) {
  /**
   * Latest state does not match state immediately after action was dispatched,
   * but when it is queued by {@link watchPersistAsync}.
   */
  const latestState: RootState = yield* select()
  if (latestState.persist.isPersistenceUnsupported) throw new Error('Persistence not supported')
  const keyWithSalt = yield* call(deriveKeyFromPassword, password)
  const encryptedState = yield* call(encryptState, latestState, keyWithSalt)
  window.localStorage.setItem(STORAGE_FIELD, encryptedState)
  const encryptedState2 = window.localStorage.getItem(
    STORAGE_FIELD,
  ) as EncryptedString<PersistedRootState> | null
  const unlockedPayload = yield* call(decryptState, encryptedState2!, password)
  yield* put(persistActions.setUnlockedRootState(unlockedPayload))
}

function* unlockAsync(action: ReturnType<typeof persistActions.unlockAsync>) {
  const encryptedState = window.localStorage.getItem(
    STORAGE_FIELD,
  ) as EncryptedString<PersistedRootState> | null
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

function* updatePasswordAsync(action: ReturnType<typeof persistActions.updatePasswordAsync>) {
  const encryptedState = window.localStorage.getItem(
    STORAGE_FIELD,
  ) as EncryptedString<PersistedRootState> | null
  if (!encryptedState) throw new Error('Unexpected update password action while no state is locked')
  try {
    // used only for a current password validation, doesn't use decrypted result
    yield* call(decryptState, encryptedState, action.payload.currentPassword)
    yield* put(persistActions.setPasswordAsync({ password: action.payload.password }))
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

function* deleteProfileAsync(action: ReturnType<typeof persistActions.deleteProfileAsync>) {
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

function* finishV0Migration(action: ReturnType<typeof persistActions.finishV0Migration>) {
  yield* put(
    persistActions.setUnlockedRootState({
      persistedRootState: action.payload.persistedRootState,
      stringifiedEncryptionKey: 'skipped',
    }),
  )
  yield* call(setPasswordAsync, action.payload.password)

  // Just being extra careful before deleting old state
  const stateAfterMigration: RootState = yield* select()
  if (
    Object.values(action.payload.persistedRootState.wallet.wallets).length !==
    Object.values(stateAfterMigration.wallet.wallets).length
  ) {
    throw new Error('Something went wrong during V0 state migration')
  }

  yield* call(backupAndDeleteV0ExtProfile)
}

// Encrypting
async function encryptState(
  state: RootState,
  keyWithSalt: KeyWithSalt,
): Promise<EncryptedString<PersistedRootState>> {
  const persistedRootState: PersistedRootState = {
    contacts: state.contacts,
    evmAccounts: state.evmAccounts,
    theme: state.theme,
    wallet: state.wallet,
    network: state.network,
  }
  const encryptedState = await encryptWithKey(keyWithSalt, persistedRootState)
  return encryptedState
}

async function decryptState(
  encryptedState: EncryptedString<PersistedRootState>,
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

function* retainEncryptionKeyBetweenPopupReopenings() {
  if (runtimeIs !== 'extension') return
  yield* fork(function* () {
    const channelQueue = yield* actionChannel<AnyAction>('*')
    let previousStringifiedEncryptionKey: PersistState['stringifiedEncryptionKey'] = undefined
    while (true) {
      yield* take(channelQueue)
      const stringifiedEncryptionKey = yield* select(selectStringifiedEncryptionKey)
      if (stringifiedEncryptionKey !== previousStringifiedEncryptionKey) {
        previousStringifiedEncryptionKey = stringifiedEncryptionKey
        yield* call(writeSharedExtMemory, stringifiedEncryptionKey)
      }
    }
  })

  yield* fork(function* () {
    const encryptedState = window.localStorage.getItem(
      STORAGE_FIELD,
    ) as EncryptedString<PersistedRootState> | null
    if (!encryptedState) return // Ignore
    try {
      const stringifiedEncryptionKey = yield* call(readSharedExtMemory)
      if (!stringifiedEncryptionKey) return // Ignore
      if (stringifiedEncryptionKey === 'skipped') return // Ignore
      const keyWithSalt: KeyWithSalt = fromBase64andParse(stringifiedEncryptionKey)
      const persistedRootState = yield* call(decryptWithKey<PersistedRootState>, keyWithSalt, encryptedState)
      yield* put(persistActions.setUnlockedRootState({ persistedRootState, stringifiedEncryptionKey }))
    } catch (error) {
      // Ignore
    }
  })
}

async function writeSharedExtMemory(stringifiedEncryptionKey: PersistState['stringifiedEncryptionKey']) {
  if (runtimeIs !== 'extension') return
  const browser = await import('webextension-polyfill')
  await browser.storage.session.set({ stringifiedEncryptionKey })
}

async function readSharedExtMemory() {
  if (runtimeIs !== 'extension') return
  const browser = await import('webextension-polyfill')
  const storage = await browser.storage.session.get('stringifiedEncryptionKey')
  return storage.stringifiedEncryptionKey as PersistState['stringifiedEncryptionKey']
}

export function* persistSaga() {
  yield* watchPersistAsync()
  yield* retainEncryptionKeyBetweenPopupReopenings()
  const storageV0 = yield* call(readStorageV0)
  yield* put(persistActions.setHasV0StorageToMigrate(!!storageV0?.chromeStorageLocal.keyringData))
}
