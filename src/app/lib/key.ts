import nacl from 'tweetnacl'
import { base64ToUint, uint2hex } from './helpers'

/**
 * Verify if a key pair is actually usable for signatures
 */
function canSignWith(keyPair: nacl.SignKeyPair) {
  const { secretKey, publicKey } = keyPair
  const testMessage = Uint8Array.from([1, 2, 3])
  const signedTestMessage = nacl.sign(testMessage, secretKey)
  const testDecoded = nacl.sign.open(signedTestMessage, publicKey)
  return testDecoded && uint2hex(testDecoded) === uint2hex(testMessage)
}

export class OasisKey {
  public static fromBase64PrivateKey(key: string): Uint8Array {
    const keyWithoutEnvelope = key
      .replace(/\n/gm, '')
      .replace(/ /g, '')
      .replace(/^-----.*?-----/, '')
      .replace(/-----.*?-----$/, '')

    const key_bytes = base64ToUint(keyWithoutEnvelope)
    return OasisKey.fromPrivateKey(key_bytes)
  }

  /**
   * @param key 32-bytes seed or 64-bytes secret (seed + public)
   * @returns 64-bytes secret
   */
  public static fromPrivateKey(key: Uint8Array): Uint8Array {
    if (key.length === 32) {
      return nacl.sign.keyPair.fromSeed(key).secretKey
    } else if (key.length === 64) {
      const keyPair = nacl.sign.keyPair.fromSecretKey(key)
      if (!canSignWith(keyPair)) {
        throw new Error('Invalid private key. There must a typo somewhere.')
      }
      return keyPair.secretKey
    } else {
      throw new Error('Invalid private key shape')
    }
  }
}
