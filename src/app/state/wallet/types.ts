import { BalanceDetails } from '../account/types'

export enum WalletType {
  Ledger = 'ledger',
  BleLedger = 'ble_ledger',
  PrivateKey = 'private_key',
  Mnemonic = 'mnemonic',
}

export type LedgerWalletType = WalletType.Ledger | WalletType.BleLedger

export interface BalanceUpdatePayload {
  address: string
  balance: BalanceDetails
}

export interface Wallet {
  publicKey: string
  address: string
  type: WalletType
  path?: number[]
  pathDisplay?: string
  privateKey?: string
  balance: BalanceDetails & {
    /** @deprecated This property is not reliably present */
    address?: string
    /** @deprecated This property is not reliably present */
    allowances?: any[]
    /** @deprecated This property is not reliably present */
    validator?: any
  }
  name?: string
}

export interface AddWalletPayload extends Wallet {
  selectImmediately: boolean
}

export interface OpenFromPrivateKeyPayload {
  privateKey: string
  choosePassword: string | undefined
}

export interface OpenSelectedAccountsPayload {
  choosePassword: string | undefined
}

/* --- STATE --- */
export interface WalletState {
  /** @deprecated This property was removed after 76fbf9a */
  isOpen?: boolean
  selectedWallet?: string
  wallets: { [address: string]: Wallet }
}
