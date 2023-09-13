import { canAccessBle, Ledger, LedgerSigner, requestDevice } from '../ledger'
import OasisApp from '@oasisprotocol/ledger'
import { WalletError, WalletErrors } from 'types/errors'
import { Wallet, WalletType } from 'app/state/wallet/types'
import { isSupported, requestLedgerDevice } from '@ledgerhq/hw-transport-webusb/lib-es/webusb'
import BleTransport from '@oasisprotocol/ionic-ledger-hw-transport-ble/lib'

jest.mock('@ledgerhq/hw-transport-webusb/lib-es/webusb')
jest.mock('@oasisprotocol/ionic-ledger-hw-transport-ble/lib', () => {
  return {
    isEnabled: jest.fn(),
  }
})

jest.mock('@oasisprotocol/ledger', () => ({
  ...(jest.createMockFromModule('@oasisprotocol/ledger') as any),
  successOrThrow: jest.requireActual('@oasisprotocol/ledger').successOrThrow,
}))

function mockAppIsOpen(appName: string) {
  const appInfo = jest.mocked(OasisApp.prototype.appInfo)
  appInfo.mockResolvedValueOnce({ appName: appName, return_code: 0x9000, error_message: '' })
}

describe('Extension access', () => {
  it('should return a ledger device when web usb is supported', async () => {
    const device = {} as USBDevice
    jest.mocked(isSupported).mockResolvedValue(true)
    jest.mocked(requestLedgerDevice).mockResolvedValue(device)
    const result = await requestDevice()
    expect(result).toBe(device)
  })
})

describe('Ledger Library', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('BLE Ledger', () => {
    it('should support Bluetooth', async () => {
      ;(BleTransport.isEnabled as jest.Mock).mockResolvedValue(true)
      Object.defineProperty(window.navigator, 'bluetooth', {
        writable: true,
        value: {
          requestLEScan: jest.fn(),
        },
      })

      const canAccessBluetooth = await canAccessBle()
      expect(canAccessBluetooth).toBe(true)
    })

    it('should not throw if platform does not support Bluetooth', async () => {
      ;(BleTransport.isEnabled as jest.Mock).mockRejectedValue(
        new Error('Platform does not support Bluetooth'),
      )

      const canAccessBluetooth = await canAccessBle()
      expect(canAccessBluetooth).toBe(false)
    })
  })

  describe('Ledger', () => {
    it('enumerateAccounts should pass when Oasis App is open', async () => {
      mockAppIsOpen('Oasis')
      const accounts = Ledger.enumerateAccounts({} as any, 0)
      await expect(accounts).resolves.toEqual([])
    })

    it('Should catch "Oasis App is not open"', async () => {
      mockAppIsOpen('BOLOS')
      const accountsMainMenu = Ledger.enumerateAccounts({} as any, 0)
      await expect(accountsMainMenu).rejects.toThrowError(WalletError)
      await expect(accountsMainMenu).rejects.toHaveProperty('type', WalletErrors.LedgerOasisAppIsNotOpen)

      mockAppIsOpen('Ethereum')
      const accountsEth = Ledger.enumerateAccounts({} as any, 0)
      await expect(accountsEth).rejects.toThrowError(WalletError)
      await expect(accountsEth).rejects.toHaveProperty('type', WalletErrors.LedgerOasisAppIsNotOpen)
    })

    it('Should enumerate and return the accounts', async () => {
      mockAppIsOpen('Oasis')
      const pubKey = jest.mocked(OasisApp.prototype.publicKey)
      pubKey.mockResolvedValueOnce({
        return_code: 0x9000,
        pk: Buffer.from(new Uint8Array([1, 2, 3])),
        error_message: '',
      })
      pubKey.mockResolvedValueOnce({
        return_code: 0x9000,
        pk: Buffer.from(new Uint8Array([4, 5, 6])),
        error_message: '',
      })

      const accounts = await Ledger.enumerateAccounts({} as any, 2)
      expect(accounts).toHaveLength(2)
      expect(accounts).toContainEqual({
        path: [44, 474, 0, 0, 0],
        pathDisplay: `m/44'/474'/0'/0'/0'`,
        publicKey: new Uint8Array([1, 2, 3]),
      })
      expect(accounts).toContainEqual({
        path: [44, 474, 0, 0, 1],
        pathDisplay: `m/44'/474'/0'/0'/1'`,
        publicKey: new Uint8Array([4, 5, 6]),
      })
    })

    it('Should catch Cannot open Oasis app', async () => {
      mockAppIsOpen('Oasis')
      const pubKey = jest.mocked(OasisApp.prototype.publicKey)
      pubKey.mockResolvedValueOnce({ return_code: 0x6804, error_message: '' })

      const accounts = Ledger.enumerateAccounts({} as any)
      await expect(accounts).rejects.toThrowError(WalletError)
      await expect(accounts).rejects.toHaveProperty('type', WalletErrors.LedgerCannotOpenOasisApp)
    })

    it('Should catch App version not supported', async () => {
      mockAppIsOpen('Oasis')
      const pubKey = jest.mocked(OasisApp.prototype.publicKey)
      pubKey.mockResolvedValueOnce({ return_code: 0x6400, error_message: '' })

      const accounts = Ledger.enumerateAccounts({} as any)
      await expect(accounts).rejects.toThrowError(WalletError)
      await expect(accounts).rejects.toHaveProperty('type', WalletErrors.LedgerAppVersionNotSupported)
    })

    it('Should catch ledger unknown errors', async () => {
      mockAppIsOpen('Oasis')
      const pubKey = jest.mocked(OasisApp.prototype.publicKey)
      pubKey.mockResolvedValueOnce({ return_code: -1, error_message: 'unknown dummy error' })

      const accounts = Ledger.enumerateAccounts({} as any)
      await expect(accounts).rejects.toThrowError(WalletError)
      await expect(accounts).rejects.toThrow(/unknown dummy error/)
      await expect(accounts).rejects.toHaveProperty('type', WalletErrors.LedgerUnknownError)
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
        new LedgerSigner({ type: WalletType.UsbLedger } as Wallet)
      }
      expect(openWallet).toThrow(/ not a ledger wallet/)
    })

    it('Should fail without USB transport', async () => {
      const signer = new LedgerSigner({
        type: WalletType.UsbLedger,
        path: [44, 474, 0, 0, 0],
        pathDisplay: `m/44'/474'/0'/0'/0'`,
        publicKey: '00',
      } as Wallet)

      await expect(signer.sign('', new Uint8Array())).rejects.toThrow(
        /Cannot sign using ledger without an active WebUSB transport/,
      )
    })

    it('Should return the public key', () => {
      const signer = new LedgerSigner({
        type: WalletType.UsbLedger,
        path: [44, 474, 0, 0, 0],
        pathDisplay: `m/44'/474'/0'/0'/0'`,
        publicKey: 'aabbcc',
      } as Wallet)

      expect(signer.public()).toEqual(new Uint8Array([170, 187, 204]))
    })

    it('Should throw if the transaction was rejected', async () => {
      const pubKey = jest.mocked(OasisApp.prototype.publicKey)
      pubKey.mockResolvedValueOnce({
        return_code: 0x9000,
        pk: Buffer.from(new Uint8Array([0])),
        error_message: '',
      })
      const sign = jest.mocked(OasisApp.prototype.sign)
      sign.mockResolvedValueOnce({ return_code: 0x6986, error_message: '' })

      const signer = new LedgerSigner({
        type: WalletType.UsbLedger,
        path: [44, 474, 0, 0, 0],
        pathDisplay: `m/44'/474'/0'/0'/0'`,
        publicKey: '00',
      } as Wallet)

      signer.setTransport({} as any)
      const result = signer.sign('', new Uint8Array())
      await expect(result).rejects.toThrowError(WalletError)
      await expect(result).rejects.toHaveProperty('type', WalletErrors.LedgerTransactionRejected)
    })

    it('Should return the signature', async () => {
      const pubKey = jest.mocked(OasisApp.prototype.publicKey)
      pubKey.mockResolvedValueOnce({
        return_code: 0x9000,
        pk: Buffer.from(new Uint8Array([0])),
        error_message: '',
      })
      const sign = jest.mocked(OasisApp.prototype.sign)
      sign.mockResolvedValueOnce({
        return_code: 0x9000,
        signature: Buffer.from(new Uint8Array([1, 2, 3])),
        error_message: '',
      })

      const signer = new LedgerSigner({
        type: WalletType.UsbLedger,
        path: [44, 474, 0, 0, 0],
        pathDisplay: `m/44'/474'/0'/0'/0'`,
        publicKey: '00',
      } as Wallet)

      signer.setTransport({} as any)
      await expect(signer.sign('', new Uint8Array())).resolves.toEqual(new Uint8Array([1, 2, 3]))
    })
  })
})
