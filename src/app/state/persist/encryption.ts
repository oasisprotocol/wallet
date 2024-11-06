import { EncryptedObject, EncryptedString, KeyWithSalt } from './types'
import nacl from 'tweetnacl'
import { PasswordWrongError } from 'types/errors'

export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array = crypto.getRandomValues(new Uint8Array(32)),
): Promise<KeyWithSalt> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  const passwordDerivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 310000, // OWASP 2021
      hash: 'SHA-256',
    },
    key,
    nacl.secretbox.keyLength * 8,
  )
  return {
    key: new Uint8Array(passwordDerivedBits),
    salt: salt,
  }
}

export async function encryptWithKey<T>(keyWithSalt: KeyWithSalt, dataObj: T): Promise<EncryptedString<T>> {
  const dataBytes = new TextEncoder().encode(JSON.stringify(dataObj))
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
  const encryptedObj: EncryptedObject = {
    secretbox: nacl.secretbox(dataBytes, nonce, keyWithSalt.key),
    nonce: nonce,
    salt: keyWithSalt.salt,
  }
  const encryptedString = base64andStringify(encryptedObj) as EncryptedString<T>
  return encryptedString
}

export async function decryptWithPassword<T>(
  password: string,
  encryptedString: EncryptedString<T>,
): Promise<T> {
  const encryptedObj = fromBase64andParse<EncryptedObject>(encryptedString)
  const derivedKeyWithSalt = await deriveKeyFromPassword(password, encryptedObj.salt)
  return await decryptWithKey(derivedKeyWithSalt, encryptedString)
}

export async function decryptWithKey<T>(
  derivedKeyWithSalt: KeyWithSalt,
  encryptedString: EncryptedString<T>,
): Promise<T> {
  const encryptedObj = fromBase64andParse<EncryptedObject>(encryptedString)
  const dataBytes = nacl.secretbox.open(encryptedObj.secretbox, encryptedObj.nonce, derivedKeyWithSalt.key)
  if (!dataBytes) throw new PasswordWrongError()

  const dataObj: T = JSON.parse(new TextDecoder().decode(dataBytes))
  return dataObj
}

export function base64andStringify<T>(obj: T) {
  return JSON.stringify(obj, (k, v) => {
    if (v instanceof Uint8Array) return { $Uint8Array$: Buffer.from(v).toString('base64') }
    return v
  })
}

export function fromBase64andParse<T>(str: string): T {
  return JSON.parse(str, (k, v) => {
    if (typeof v === 'object' && '$Uint8Array$' in v)
      return new Uint8Array(Buffer.from(v.$Uint8Array$, 'base64'))
    return v
  })
}
