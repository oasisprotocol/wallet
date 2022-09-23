import { StringifiedBigInt } from 'types/StringifiedBigInt'

export enum WalletType {
  Ledger = 'ledger',
  PrivateKey = 'private_key',
  Mnemonic = 'mnemonic',
}

/**
 * WalletBalance
 *
 * We stock the amounts as strings to work around
 * poor bigint support in JS
 *
 */
export interface WalletBalance {
  available: StringifiedBigInt
  validator: {
    escrow: StringifiedBigInt
    escrow_debonding: StringifiedBigInt
  }
}

export interface BalanceUpdatePayload {
  address: string
  balance: WalletBalance
}

export interface Wallet {
  publicKey: string
  address: string
  type: WalletType
  path?: number[]
  privateKey?: string
  balance: WalletBalance
}

export interface AddWalletPayload extends Wallet {
  selectImmediately: boolean
}

/* --- STATE --- */
export interface WalletState {
  isOpen: boolean
  selectedWallet?: string
  wallets: { [address: string]: Wallet }
}
