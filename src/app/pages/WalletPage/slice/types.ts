import { ErrorPayload } from 'types/errors'

export enum TransactionType {
  SENT = 0,
  RECEIVED = 1,
}

export enum WalletType {
  Ledger = 'ledger',
  PrivateKey = 'private_key',
  Mnemonic = 'mnemonic',
}

export interface Transaction {
  address: string
  date: number
  amount: number
  type: TransactionType
}

export interface TransactionSent {
  from: string
  to: string
  amount: number
}
export interface SendTransactionPayload {
  /* bech32 Address */
  to: string

  /* Token amount */
  amount: number
}

/**
 * WalletBalance
 *
 * We stock the amounts as strings to work around
 * poor bigint support in JS
 *
 */
export interface WalletBalance {
  available: string
  escrow: string
  debonding: string
}

export interface Wallet {
  publicKey: string
  address: string
  type?: WalletType
  privateKey?: string
}

export interface TransactionStatus {
  success: boolean
  error?: ErrorPayload
}

/* --- STATE --- */
export interface WalletState extends Wallet {
  isOpen: boolean
  balance: WalletBalance
  transaction: TransactionStatus
}
