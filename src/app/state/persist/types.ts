import { RootState } from 'types'

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
export type EncryptedString = string & PreserveAliasName
// Hover to check if inferred variable type is EncryptedString (not string)
export const testPreserveAliasName = '{}' as EncryptedString

export interface SyncedRootState extends Pick<RootState, 'theme' | 'wallet' | 'network'> {}
