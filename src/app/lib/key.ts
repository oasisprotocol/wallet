import nacl from 'tweetnacl'

export class OasisKey {
  /**
   * @param key 32-bytes seed or 64-bytes secret (seed + public)
   * @returns 64-bytes secret
   */
  public static fromPrivateKey(key: Uint8Array): Uint8Array {
    try {
      if (key.length === 32) {
        return nacl.sign.keyPair.fromSeed(key).secretKey
      } else if (key.length === 64) {
        return nacl.sign.keyPair.fromSecretKey(key).secretKey
      } else {
        throw new Error('Invalid private key shape')
      }
    } catch (e) {
      throw e
    }
  }
}
