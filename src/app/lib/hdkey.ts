import { eddsa } from 'elliptic'
import { sha512 } from 'js-sha512'
import { sha256 } from 'js-sha256'
import * as BN from 'bn.js'
import { concat } from './helpers'
import { Signer } from '@oasisprotocol/client/dist/signature'
import { generateMnemonic, mnemonicToSeed, mnemonicToSeedSync } from 'bip39'

// Shorthand for Bignumber instanciation
const bn = (i: number | string | Uint8Array, endianness?: 'le' | 'be') => new BN.BN(i, endianness)

/**
 * Hierarchical deterministic keys using Ed25519
 *
 * Implements BIP32-Ed25519 to securely derive keys from a parent
 * 32-bytes seed, itself usually generated from a BIP39 mnemonic.
 */
export class HDKey implements Signer {
  public readonly secret: Uint8Array

  // Curve Parameters
  protected static eddsa = new eddsa('ed25519')
  protected static bp = HDKey.eddsa.curve.g
  protected static n = HDKey.eddsa.curve.n

  constructor(
    public readonly kL: Uint8Array,
    public readonly kR: Uint8Array,
    public readonly A: Uint8Array,
    public readonly c?: Uint8Array,
  ) {
    this.secret = concat(kL, kR)
  }

  /**
   * Returns the root node for the given mnemonic
   * @param mnemonic Bip39 Mnemonic
   * @returns Root node
   */
  public static async fromMnemonic(mnemonic: string): Promise<HDKey> {
    const seed = await mnemonicToSeed(mnemonic)
    return HDKey.fromSeed(seed.slice(0, 32))
  }

  /**
   * Generates a safe mnemonic
   * @param strength Length in bits of the generated mnemonic
   * @returns Generated BIP39 Mnemonic
   */
  public static generateValidMnemonic(strength = 256): string {
    let mnemonic = generateMnemonic(strength)
    while (!HDKey.isValidMnemonic(mnemonic)) {
      mnemonic = generateMnemonic(strength)
    }

    return mnemonic
  }

  /**
   * Checks if the given bip39 mnemonic is valid for Ed25519 derivation
   * If it is not, you must generate another one.
   * @param mnemonic
   */
  public static isValidMnemonic(mnemonic: string): boolean {
    const seed = mnemonicToSeedSync(mnemonic)
    const hash = new Uint8Array(sha512.arrayBuffer(seed.slice(0, 32)))

    // If the third highest bit of the lasst byte of kL is not zero, discard k
    return (hash[31] & 0b00100000) === 0
  }

  public static fromSecret(secret: Uint8Array): HDKey {
    const kL = secret.slice(0, 32),
      kR = secret.slice(32)

    const A = new Uint8Array(HDKey.eddsa.encodePoint(HDKey.bp.mul(bn(kL, 'le'))))

    return new HDKey(kL, kR, A)
  }

  /**
   * Returns the root node for the given 32 bytes seed
   * @param seed 32 bytes seed
   * @returns Root node
   */
  public static fromSeed(seed: Uint8Array): HDKey {
    if (seed.length !== 32) throw new Error('Seed must be 32 bytes (a Uint8Array of size 32)')

    const k = new Uint8Array(sha512.arrayBuffer(seed))
    const kL = k.slice(0, 32),
      kR = k.slice(32)

    //  If the third highest bit of the last byte of kL is not zero, discard k
    if (kL[31] & 0b00100000) {
      throw new Error('Insecure seed')
    }

    // clear lowest three bits of the first byte
    // clear highest bit of the last byte
    // set second highest bit of the last byte
    kL[0] &= 248
    kL[31] &= 127
    kL[31] |= 64

    // Get the public key
    const A = new Uint8Array(HDKey.eddsa.encodePoint(HDKey.bp.mul(bn(kL, 'le'))))

    const chaincodePayload = concat(new Uint8Array([1]), seed)
    const c = new Uint8Array(sha256.arrayBuffer(chaincodePayload))

    return new HDKey(kL, kR, A, c)
  }

  /**
   * Derive a new key at the specified derivation path from the current key
   * @param path Derivation path, using ' for hardened indexes
   * @returns Child node at path
   */
  public derivePath(path: string): HDKey {
    let node: HDKey = this
    const chain = path.split('/')

    for (let i = 0; i < chain.length; i++) {
      let index
      if (!chain[i]) {
        continue
      } else if (chain[i].endsWith("'")) {
        // Hardened offset ; @todo 0x8...
        index = bn(chain[i].slice(0, -1)).add(bn(2).pow(bn(31)))
      } else {
        // Non hardened path
        index = bn(chain[i])
      }

      node = node.deriveChild(index)
    }
    return node
  }

  /**
   * Derive a new key from the current key
   * Use index > 2^31 for a hardened key,
   * or (index + 0x80000000).
   *
   * @param index Index to use for derivation
   * @returns Child node at given index
   */
  public deriveChild(index: BN): HDKey {
    if (!this.c) {
      throw new Error('Cannot derive key without chaincode')
    }

    const kLP = this.kL,
      kRP = this.kR,
      AP = this.A,
      cP = this.c

    if (!(index.gte(bn(0)) && index.lt(bn(2).pow(bn(32))))) {
      throw new Error('Index i must be between 0 and 2^32 - 1, inclusive')
    }

    const i_bytes = index.toArrayLike(Buffer, 'le', 4)

    let Z: Uint8Array, c: Uint8Array
    if (index.lt(bn(2).pow(bn(31)))) {
      // regular child
      Z = this.hmacSha512(concat(new Uint8Array([2]), new Uint8Array(AP), i_bytes), cP)
      c = this.hmacSha512(concat(new Uint8Array([3]), new Uint8Array(AP), i_bytes), cP).slice(32)
    } else {
      // hardened child
      Z = this.hmacSha512(concat(new Uint8Array([0]), kLP, kRP, i_bytes), cP)
      c = this.hmacSha512(concat(new Uint8Array([1]), kLP, kRP, i_bytes), cP).slice(32)
    }

    const ZL = Z.slice(0, 28),
      ZR = Z.slice(32)

    const kLn = bn(ZL, 'le').mul(bn(8)).add(bn(kLP, 'le'))

    // "If kL is divisible by the base order n, discard the child."
    // - "BIP32-Ed25519 Hierarchical Deterministic Keys over a Non-linear Keyspace" (https://drive.google.com/file/d/0ByMtMw2hul0EMFJuNnZORDR2NDA/view)
    if (kLn.mod(HDKey.n).eq(bn(0))) {
      throw new Error('Insecure child key')
    }

    const kRn = bn(ZR, 'le')
      .add(bn(kRP, 'le'))
      .mod(bn(2).pow(bn(256)))

    const kL = new Uint8Array(kLn.toArrayLike(Buffer, 'le', 32))
    const kR = new Uint8Array(kRn.toArrayLike(Buffer, 'le', 32))

    const A = HDKey.eddsa.encodePoint(HDKey.bp.mul(bn(kL, 'le')))

    return new HDKey(kL, kR, A, c)
  }

  /**
   * Signs the given message with the current key
   * @param message Message to sign
   * @returns Signed message
   */
  public async sign(message: Uint8Array): Promise<Uint8Array> {
    const kL = this.kL
    const kR = this.kR
    const A = new Uint8Array(this.A)
    const M = message
    const n = HDKey.n // Base order

    const r_hash = new Uint8Array(sha512.arrayBuffer(concat(kR, M)))
    const r = bn(r_hash, 'le').mod(n)
    const R = HDKey.eddsa.encodePoint(HDKey.bp.mul(r))
    const x_hash = new Uint8Array(sha512.arrayBuffer(concat(R, A, M)))
    const x = bn(x_hash, 'le')

    const S = r
      .add(x.mul(bn(kL, 'le')))
      .mod(n)
      .toArrayLike(Buffer, 'le', 32)

    return concat(R, S)
  }

  /**
   * Returns the public key of this Ed25519 derivation node
   * @returns Public key
   */
  public public(): Uint8Array {
    return this.A
  }

  /**
   * Returns a SHA512-Hmac digest
   * @param message Payload to hash
   * @param key HMAC Key
   * @returns Digest
   */
  private hmacSha512(message: Uint8Array, key: Uint8Array): Uint8Array {
    // Invalid types for key inside js-sha512 - See https://github.com/emn178/js-sha512/issues/18
    const hash = sha512.hmac
      .create(key as any)
      .update(message)
      .arrayBuffer()
    return new Uint8Array(hash)
  }
}
