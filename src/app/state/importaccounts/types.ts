import { ErrorPayload } from 'types/errors'
import { WalletType } from '../wallet/types'
import { BalanceDetails } from '../account/types'

/* --- STATE --- */
export interface ImportAccountsListAccount {
  address: string
  balance?: BalanceDetails
  path: number[]
  pathDisplay: string
  privateKey?: string
  publicKey: string
  selected: boolean
  type: WalletType
}

export enum ImportAccountsStep {
  Idle = 'idle',
  OpeningUSB = 'opening_usb',
  LoadingAccounts = 'loading_accounts',
  LoadingBalances = 'loading_balances',
}

export interface ImportAccountsState {
  accounts: ImportAccountsListAccount[]
  error?: ErrorPayload
  showAccountsSelectionModal: boolean
  accountsSelectionPageNumber: number
  step: ImportAccountsStep
}
