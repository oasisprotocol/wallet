import { BalanceDetails } from '../account/types'

export enum WalletType {
  UsbLedger = 'ledger',
  BleLedger = 'ble_ledger',
  PrivateKey = 'private_key',
  Mnemonic = 'mnemonic',
}

export type LedgerWalletType = WalletType.UsbLedger | WalletType.BleLedger

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
  balance: BalanceDetails
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
  selectedWallet?: string
  wallets: { [address: string]: Wallet }
}
