import { RootState } from 'types'
// eslint-disable-next-line @typescript-eslint/ban-types
interface PreserveAliasName extends String {}

export interface KeyWithSalt {
  key: Uint8Array
  salt: Uint8Array
}
/** Redux can't serialize Uint8Arrays so we base64 encode and stringify */
export type StringifiedKeyWithSalt = string & PreserveAliasName

export interface EncryptedObject {
  secretbox: Uint8Array
  nonce: Uint8Array
  salt: Uint8Array
}
/** Redux can't serialize Uint8Arrays so we base64 encode and stringify */
export type EncryptedString<T> = string & { encryptedType: T }
// Hover to check if inferred variable type is EncryptedString (not string)
export const testPreserveAliasName = '{}' as EncryptedString<any>

export interface SetUnlockedRootStatePayload {
  persistedRootState: PersistedRootState
  stringifiedEncryptionKey: StringifiedKeyWithSalt
}

export interface UpdatePasswordPayload {
  currentPassword: string
  password: string
}

export interface FinishV0MigrationPayload {
  persistedRootState: PersistedRootState
  password: string
}

/* --- STATE --- */
export interface PersistState {
  hasPersistedProfiles: boolean
  hasV0StorageToMigrate: boolean
  isPersistenceUnsupported: boolean
  loading: boolean
  stringifiedEncryptionKey: undefined | 'skipped' | StringifiedKeyWithSalt
  enteredWrongPassword: boolean
}

export interface PersistedRootState
  extends Pick<RootState, 'contacts' | 'evmAccounts' | 'theme' | 'wallet' | 'network'> {}
export interface SyncedRootState
  extends Pick<RootState, 'contacts' | 'evmAccounts' | 'theme' | 'wallet' | 'network' | 'persist'> {}
