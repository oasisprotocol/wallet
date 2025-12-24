import { ErrorPayload } from 'types/errors'
import { WalletType } from '../wallet/types'
import { BalanceDetails } from '../account/types'
import { ScanResult } from '@capacitor-community/bluetooth-le'

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
  AccessingLedger = 'accessing_ledger',
  LoadingAccounts = 'loading_accounts',
  LoadingBalances = 'loading_balances',
  LoadingBleDevices = 'loading_devices',
}

export interface ImportAccountsState {
  accounts: ImportAccountsListAccount[]
  error?: ErrorPayload
  showAccountsSelectionModal: boolean
  accountsSelectionPageNumber: number
  step: ImportAccountsStep
  bleDevices: ScanResult[]
  selectedBleDevice?: ScanResult
  showBleLedgerDevicesModal: boolean
}
