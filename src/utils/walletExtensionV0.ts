import { runtimeIs } from '../config'
import { decrypt as metamaskDecrypt } from '@metamask/browser-passworder'
import { PersistedRootState } from '../app/state/persist/types'
import { initialState as initialNetworkState } from '../app/state/network'
import { Wallet, WalletType } from '../app/state/wallet/types'
import { hex2uint, uint2hex } from '../app/lib/helpers'
import { OasisKey } from '../app/lib/key'
import { PasswordWrongError } from '../types/errors'
import { LanguageKey } from '../locales/i18n'

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

export interface MigratingV0State {
  mnemonic: string
  invalidPrivateKeys: { privateKeyWithTypos: string; name: string; address: `oasis1${string}` }[]
  language: LanguageKey
  state: PersistedRootState
}

export async function readStorageV0() {
  return (await import('./__fixtures__/test-inputs')).walletExtensionV0PersistedState
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

async function typedMetamaskDecrypt<T>(password: string, encrypted: EncryptedString<T>): Promise<T> {
  try {
    return await metamaskDecrypt(password, encrypted)
  } catch (error) {
    throw new PasswordWrongError()
  }
}

function typedJsonParse<T>(str: StringifiedType<T>): T {
  return JSON.parse(str)
}

function validateAndExpandPrivateKey(privateKeyLongOrShortOrTyposHex: string): string | '' {
  try {
    return uint2hex(OasisKey.fromPrivateKey(hex2uint(privateKeyLongOrShortOrTyposHex)))
  } catch (e) {
    return ''
  }
}

export async function decryptWithPasswordV0(
  password: string,
  extensionV0State: WalletExtensionV0State,
): Promise<MigratingV0State> {
  if (!extensionV0State.chromeStorageLocal.keyringData) throw new Error('No v0 encrypted data')
  const keyringData = (
    await typedMetamaskDecrypt(password, extensionV0State.chromeStorageLocal.keyringData)
  )[0]
  const mnemonic = await typedMetamaskDecrypt(password, keyringData.mnemonic)

  const decryptedAccounts = await Promise.all(
    keyringData.accounts.map(async acc => {
      if (!('privateKey' in acc)) return acc
      const privateKeyLongOrShortOrTypos = await typedMetamaskDecrypt(password, acc.privateKey)
      if (acc.type === 'WALLET_OUTSIDE_SECP256K1') {
        return {
          ...acc,
          privateKey: privateKeyLongOrShortOrTypos,
          privateKeyLongOrShortOrTypos,
        }
      }

      const privateKey = validateAndExpandPrivateKey(privateKeyLongOrShortOrTypos)
      return {
        ...acc,
        privateKey,
        privateKeyLongOrShortOrTypos,
      }
    }),
  )

  const [validAccounts, invalidAccounts] = [
    decryptedAccounts
      .map(acc => ('privateKey' in acc && acc.privateKey === '' ? undefined : acc))
      .filter((a): a is NonNullable<typeof a> => !!a),
    decryptedAccounts
      .map(acc => ('privateKey' in acc && acc.privateKey === '' ? acc : undefined))
      .filter((a): a is NonNullable<typeof a> => !!a),
  ]

  const wallets = Object.fromEntries(
    validAccounts
      .map((acc): undefined | Wallet => {
        if (acc.type === 'WALLET_INSIDE') {
          return {
            publicKey: acc.publicKey,
            address: acc.address,
            type: WalletType.Mnemonic,
            path: [44, 474, acc.hdPath],
            pathDisplay: `m/44'/474'/${acc.hdPath}'`,
            privateKey: acc.privateKey,
            balance: {
              available: null,
              debonding: null,
              delegations: null,
              total: null,
            },
            name: acc.accountName,
          }
        }
        if (acc.type === 'WALLET_OUTSIDE') {
          return {
            publicKey: acc.publicKey,
            address: acc.address,
            type: WalletType.PrivateKey,
            privateKey: acc.privateKey,
            balance: {
              available: null,
              debonding: null,
              delegations: null,
              total: null,
            },
            name: acc.accountName,
          }
        }
        if (acc.type === 'WALLET_LEDGER') {
          return {
            publicKey: acc.publicKey,
            address: acc.address,
            type: WalletType.Ledger,
            path: [44, 474, 0, 0, acc.ledgerHdIndex],
            pathDisplay: `m/44'/474'/0'/0'/${acc.ledgerHdIndex}'`,
            balance: {
              available: null,
              debonding: null,
              delegations: null,
              total: null,
            },
            name: acc.accountName,
          }
        }
        return undefined
      })
      .filter((a): a is NonNullable<typeof a> => !!a)
      .map(a => [a.address, a]),
  )

  const invalidPrivateKeys = [
    ...invalidAccounts.map(a => ({
      privateKeyWithTypos: a.privateKeyLongOrShortOrTypos,
      name: a.accountName,
      address: a.address,
    })),
    {
      privateKeyWithTypos:
        '0bb00ec55763b2ae1af8daabdd37437c0ff63734add1b7d84bb107bb3924d2d030e9d3b848b00ccf447ccac41478e3f097c110816de297d8fc3945f43cb2414c',
      name: 'Attempt2',
      address: 'oasis1qrtrncgrpzmxeqkpnxyyydhlmy3zmhl9w5wp3jzl',
    },
  ]

  const evmAccounts = Object.fromEntries(
    validAccounts
      .map(acc => {
        if (acc.type !== 'WALLET_OUTSIDE_SECP256K1') return undefined
        return {
          ethPrivateKey: acc.privateKey,
          ethAddress: acc.evmAddress,
        }
      })
      .filter((a): a is NonNullable<typeof a> => !!a)
      .map(a => [a.ethAddress, a]),
  )

  const observedAccounts = validAccounts
    .filter(acc => acc.type === 'WALLET_OBSERVE')
    .map(acc => ({ name: acc.accountName, address: acc.address }))
  const addressBookAccounts = typedJsonParse(extensionV0State.localStorage.ADDRESS_BOOK_CONFIG)
  const contacts = Object.fromEntries([...observedAccounts, ...addressBookAccounts].map(a => [a.address, a]))

  const language: LanguageKey = extensionV0State.localStorage.LANGUAGE_CONFIG === 'zh_CN' ? 'zh_CN' : 'en'

  const state: PersistedRootState = {
    contacts: contacts,
    evmAccounts: evmAccounts,
    network: initialNetworkState,
    theme: {
      selected: 'light',
    },
    wallet: {
      selectedWallet: keyringData.currentAddress,
      wallets: wallets,
    },
  }
  return { mnemonic, invalidPrivateKeys, language, state }
}
