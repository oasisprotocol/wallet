import { Ledger, LedgerSigner } from './ledger'
import OasisApp from '@oasisprotocol/ledger'
import { WalletError, WalletErrors } from 'types/errors'
import { Wallet, WalletType } from 'app/state/wallet/types'

jest.mock('@oasisprotocol/ledger')

describe('Ledger Library', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Ledger', () => {
    it('Should enumerate and return the accounts', async () => {
      const pubKey: jest.Mock<any> = OasisApp.prototype.publicKey
      pubKey.mockResolvedValueOnce({ return_code: 0x9000, pk: Buffer.from(new Uint8Array([1, 2, 3])) })
      pubKey.mockResolvedValueOnce({ return_code: 0x9000, pk: Buffer.from(new Uint8Array([4, 5, 6])) })

      const accounts = await Ledger.enumerateAccounts({}, 2)
      expect(accounts).toHaveLength(2)
      expect(accounts).toContainEqual({ path: [44, 474, 0, 0, 0], publicKey: new Uint8Array([1, 2, 3]) })
      expect(accounts).toContainEqual({ path: [44, 474, 0, 0, 1], publicKey: new Uint8Array([4, 5, 6]) })
    })

    it('Should catch Cannot open Oasis app', async () => {
      const pubKey: jest.Mock<any> = OasisApp.prototype.publicKey
      pubKey.mockResolvedValueOnce({ return_code: 26628 })

      const accounts = Ledger.enumerateAccounts({})
      expect(accounts).rejects.toThrowError(WalletError)
      expect(accounts).rejects.toHaveProperty('type', WalletErrors.LedgerCannotOpenOasisApp)
    })

    it('Should catch App version not supported', async () => {
      const pubKey: jest.Mock<any> = OasisApp.prototype.publicKey
      pubKey.mockResolvedValueOnce({ return_code: 25600 })

      const accounts = Ledger.enumerateAccounts({})
      expect(accounts).rejects.toThrowError(WalletError)
      expect(accounts).rejects.toHaveProperty('type', WalletErrors.LedgerAppVersionNotSupported)
    })

    it('Should catch ledger unknown errors', async () => {
      const pubKey: jest.Mock<any> = OasisApp.prototype.publicKey
      pubKey.mockResolvedValueOnce({ return_code: -1, error_message: 'unknown dummy error' })

      const accounts = Ledger.enumerateAccounts({})
      expect(accounts).rejects.toThrowError(WalletError)
      expect(accounts).rejects.toThrow(/unknown dummy error/)
      expect(accounts).rejects.toHaveProperty('type', WalletErrors.LedgerUnknownError)
    })
  })

  describe('Ledger signer', () => {
    it('Should fail if the wallet is not a ledger', () => {
      const openWallet = () => {
        new LedgerSigner({ type: WalletType.Mnemonic } as Wallet)
      }
      expect(openWallet).toThrow(/ not a ledger wallet/)
    })

    it('Should fail if the wallet does not have a path', () => {
      const openWallet = () => {
        new LedgerSigner({ type: WalletType.Ledger } as Wallet)
      }
      expect(openWallet).toThrow(/ not a ledger wallet/)
    })

    it('Should fail without USB transport', () => {
      const signer = new LedgerSigner({
        type: WalletType.Ledger,
        path: [44, 474, 0, 0, 0],
        publicKey: '00',
      } as Wallet)

      expect(signer.sign('', new Uint8Array())).rejects.toThrow(
        /Cannot sign using ledger without an active WebUSB transport/,
      )
    })

    it('Should return the public key', () => {
      const sign: jest.Mock<any> = OasisApp.prototype.sign
      sign.mockResolvedValueOnce({ return_code: 0x9000, signature: Buffer.from(new Uint8Array([1, 2, 3])) })

      const signer = new LedgerSigner({
        type: WalletType.Ledger,
        path: [44, 474, 0, 0, 0],
        publicKey: 'aabbcc',
      } as Wallet)

      expect(signer.public()).toEqual(new Uint8Array([170, 187, 204]))
    })

    it('Should throw if the transaction was rejected', () => {
      const sign: jest.Mock<any> = OasisApp.prototype.sign
      sign.mockResolvedValueOnce({ return_code: 27014 })

      const signer = new LedgerSigner({
        type: WalletType.Ledger,
        path: [44, 474, 0, 0, 0],
        publicKey: '00',
      } as Wallet)

      signer.setTransport({})
      const result = signer.sign('', new Uint8Array())
      expect(result).rejects.toThrowError(WalletError)
      expect(result).rejects.toHaveProperty('type', WalletErrors.LedgerTransactionRejected)
    })

    it('Should return the signature', () => {
      const sign: jest.Mock<any> = OasisApp.prototype.sign
      sign.mockResolvedValueOnce({ return_code: 0x9000, signature: Buffer.from(new Uint8Array([1, 2, 3])) })

      const signer = new LedgerSigner({
        type: WalletType.Ledger,
        path: [44, 474, 0, 0, 0],
        publicKey: '00',
      } as Wallet)

      signer.setTransport({})
      expect(signer.sign('', new Uint8Array())).resolves.toEqual(new Uint8Array([1, 2, 3]))
    })
  })
})
