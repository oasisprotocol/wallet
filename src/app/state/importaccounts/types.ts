import { ErrorPayload } from 'types/errors'
import { WalletBalance, WalletType } from '../wallet/types'

/* --- STATE --- */
export interface ImportAccountsListAccount {
  address: string
  balance: WalletBalance
  path: number[]
  privateKey?: string
  publicKey: string
  selected: boolean
  type: WalletType
}

export enum ImportAccountsStep {
  OpeningUSB = 'opening_usb',
  LoadingAccounts = 'loading_accounts',
  LoadingBalances = 'loading_balances',
  Done = 'done',
}

export interface ImportAccountsState {
  accounts: ImportAccountsListAccount[]
  error?: ErrorPayload
  mnemonic?: string
  showAccountsSelectionModal: boolean
  step?: ImportAccountsStep
}
