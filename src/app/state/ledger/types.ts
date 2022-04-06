import { ErrorPayload } from 'types/errors'
import { WalletBalance } from '../wallet/types'

/* --- STATE --- */
export interface LedgerAccount {
  publicKey: string
  address: string
  path: number[]
  balance: WalletBalance
  selected: boolean
}

export enum LedgerStep {
  OpeningUSB = 'opening_usb',
  LoadingAccounts = 'loading_accounts',
  LoadingBalances = 'loading_balances',
  Done = 'done',
}

export interface LedgerState {
  accounts: LedgerAccount[]
  step?: LedgerStep
  error?: ErrorPayload
}
