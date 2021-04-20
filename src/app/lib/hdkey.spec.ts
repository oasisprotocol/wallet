import * as bip39 from 'bip39'
import * as nacl from 'tweetnacl'
import { HDKey } from './hdkey'
import { concat } from './helpers'

const toHex = (payload: Uint8Array | Buffer) => Buffer.from(payload).toString('hex')
const hexToUint = (hex: string) => new Uint8Array(Buffer.from(hex, 'hex'))

describe('HdKey', () => {
  describe('#fromMnemonic', () => {
    it('Should generate the root key from a mnemonic', async () => {
      // Unsecure genre when ahead
      const key = await HDKey.fromMnemonic('practice acoustic taxi')
      expect(toHex(key.public())).toEqual('feb4ffe1b96066dd3c25ce1c468ee70e680c6f94d87dc3f158a2c310cbf37b74')
    })

    it('Should throw on unsecure mnemonics', async () => {
      // Unsecure genre when ahead
      const key = HDKey.fromMnemonic('genre when ahead')
      expect(key).rejects.toThrow(/Insecure seed/)
    })
  })

  describe('#generateValidMnemonic', () => {
    let spy: jest.SpyInstance

    it('Should retry until it finds a secure mnemonic', async () => {
      spy = jest
        .spyOn(bip39, 'generateMnemonic')
        // Generates an unsecure seed
        .mockReturnValueOnce('genre when ahead')
        // Generates a secure seed
        .mockReturnValueOnce('practice acoustic taxi')

      const key = await HDKey.generateValidMnemonic()
      expect(spy).toHaveBeenCalledTimes(2)
      expect(key).toBe('practice acoustic taxi')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })
  })

  describe('#fromSeed', () => {
    it('Should throw with non-32 bytes seed', () => {
      const tooShort = () => {
        HDKey.fromSeed(new Uint8Array(31))
      }
      const tooLong = () => {
        HDKey.fromSeed(new Uint8Array(33))
      }

      expect(tooShort).toThrowError(/must be 32 bytes/)
      expect(tooLong).toThrowError(/must be 32 bytes/)
    })

    it('Should return node', () => {
      const node = HDKey.fromSeed(new Uint8Array(32))

      expect(toHex(node.A)).toBe('3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29')
      expect(toHex(node.kL)).toBe('5046adc1dba838867b2bbbfdd0c3423e58b57970b5267a90f57960924a87f156')
      expect(toHex(node.kR)).toBe('0a6a85eaa642dac835424b5d7c8d637c00408c7a73da672b7f498521420b6dd3')
      expect(toHex(node.c)).toBe('1a7dfdeaffeedac489287e85be5e9c049a2ff6470f55cf30260f55395ac1b159')

      expect(node.secret).toStrictEqual(concat(node.kL, node.kR))
    })

    it('Should return null on invalid last byte', () => {
      const k = new Uint8Array(32)
      k[31] = k[31] | 0b00100000

      const call = () => HDKey.fromSeed(k)
      expect(call).toThrowError(/Insecure seed/)
    })
  })

  describe('#derivePath', () => {
    const key = hexToUint('0f4b359828f822a02a907b27402f2c54a4c460233d73602fbf38ba4a191a2bc4')
    it('Should derive a valid seed', () => {
      const node = HDKey.fromSeed(key).derivePath('44/474/0/0/0')

      expect(toHex(node.kL)).toEqual('9071c4c83d9ce4736511cf2ab984c157b3a63c30abf638f5e67f485d7dfb9b5e')
    })

    it('Should derive using hardened offsets', () => {
      const node = HDKey.fromSeed(key).derivePath("44'/474'/0'/0'/0'")

      expect(toHex(node.kL)).toEqual('d03f4b1d4482e2192a0fdfbafb716a2e036e013f1e20d41bc62030a582fb9b5e')
    })

    it('Should throw on invalid indexes', () => {
      const invalidIndex = () => {
        HDKey.fromSeed(key).derivePath('-1')
      }

      expect(invalidIndex).toThrow(/Index i must be between 0 and 2\^32/)
    })
  })

  describe('#sign', () => {
    it('Should produce a valid signature', async () => {
      const seed = '0f4b359828f822a02a907b27402f2c54a4c460233d73602fbf38ba4a191a2bc4'
      const message = new Uint8Array([1, 2, 3])

      const node = HDKey.fromSeed(Buffer.from(seed, 'hex'))
      expect(toHex(node.A)).toEqual('bb851a8d18ceb11cf26d8e2a49c00ca6a31c3645e4aa6998ea286e7175eda27a')

      const signature = await node.sign(message)
      expect(toHex(signature)).toEqual(
        'e2a42678b1f466621f57a92cc8bec4270f093161380c9090923f215efe504bce46483a41b771107a5b92563ee6eef8b846362f464862725d962ea3cac0b37c08',
      )

      // We cross-validate with tweetnacl
      const verified = nacl.sign.detached.verify(message, signature, node.public())
      expect(verified).toBeTruthy()
    })
  })
})
