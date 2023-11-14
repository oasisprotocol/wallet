import { BalanceDetails } from '../account/types'

export enum WalletType {
  Ledger = 'ledger',
  PrivateKey = 'private_key',
  Mnemonic = 'mnemonic',
}

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
  selectedWallet?: string
  wallets: { [address: string]: Wallet }
}
