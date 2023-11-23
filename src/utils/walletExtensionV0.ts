import { runtimeIs } from '../config'

type EncryptedString<T> = string & { encryptedType: T }
export type StringifiedType<T> = string & { stringifiedType: T }

export type EncryptedData = EncryptedString<
  // Array with exactly one element
  [
    {
      mnemonic: EncryptedString<string> // string contains 12 or 24 words
      currentAddress: string
      accounts: Array<
        | {
            type: 'WALLET_INSIDE' // Mnemonic
            address: `oasis1${string}`
            publicKey: string // 64 hex without 0x.
            privateKey: EncryptedString<string> // 128 hex without 0x.
            hdPath: number
            accountName: string
            typeIndex: number
            localAccount?: { keyringData: 'keyringData' }
            isUnlocked?: true
          }
        | {
            type: 'WALLET_OUTSIDE' // Private key
            address: `oasis1${string}`
            publicKey: string // 64 hex without 0x.
            privateKey: EncryptedString<string> // 128 or 64 hex without 0x. Can contain typos.
            accountName: string
            typeIndex: number
            localAccount?: { keyringData: 'keyringData' }
            isUnlocked?: true
          }
        | {
            type: 'WALLET_LEDGER' // Ledger
            address: `oasis1${string}`
            publicKey: string // 64 hex without 0x.
            path: [44, 474, 0, 0, number]
            ledgerHdIndex: number
            accountName: string
            typeIndex: number
            localAccount?: { keyringData: 'keyringData' }
            isUnlocked?: true
          }
        | {
            type: 'WALLET_OBSERVE' // Watch
            address: `oasis1${string}`
            accountName: string
            typeIndex: number
            localAccount?: { keyringData: 'keyringData' }
            isUnlocked?: true
          }
        | {
            type: 'WALLET_OUTSIDE_SECP256K1' // Metamask private key
            address: `oasis1${string}`
            publicKey: `0x${string}` // 128 hex with 0x.
            evmAddress: `0x${string}` // Checksum capitalized
            privateKey: EncryptedString<string> // 64 hex without 0x.
            accountName: string
            typeIndex: number
            localAccount?: { keyringData: 'keyringData' }
            isUnlocked?: true
          }
      >
    },
  ]
>

export interface WalletExtensionV0State {
  chromeStorageLocal: {
    keyringData: undefined | EncryptedData
  }
  localStorage: {
    ADDRESS_BOOK_CONFIG: StringifiedType<Array<{ name: string; address: `oasis1${string}` }>>
    LANGUAGE_CONFIG: undefined | 'en' | 'zh_CN' // Ignored in migration
    NETWORK_CONFIG: undefined | any // Ignored in migration
    DISMISSED_NEW_EXTENSION_WARNING: undefined | any // Ignored in migration
  }
}

export async function readStorageV0() {
  if (runtimeIs !== 'extension') return
  const browser = await import('webextension-polyfill')
  return {
    chromeStorageLocal: {
      keyringData: (await browser.storage.local.get('keyringData')).keyringData,
    },
    localStorage: {
      ADDRESS_BOOK_CONFIG: window.localStorage.getItem('ADDRESS_BOOK_CONFIG') ?? '[]',
      LANGUAGE_CONFIG: window.localStorage.getItem('LANGUAGE_CONFIG') ?? undefined,
      NETWORK_CONFIG: window.localStorage.getItem('NETWORK_CONFIG') ?? undefined,
      DISMISSED_NEW_EXTENSION_WARNING:
        window.localStorage.getItem('DISMISSED_NEW_EXTENSION_WARNING') ?? undefined,
    },
  } as WalletExtensionV0State
}
