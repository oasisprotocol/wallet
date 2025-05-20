import { Transaction } from 'app/state/transaction/types'
import { ErrorPayload } from 'types/errors'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { NetworkType } from '../network/types'

export interface BalanceDetails {
  available: StringifiedBigInt | null
  /** This is delayed in getAccount by 20 seconds on oasisscan and unknown on nexus. */
  debonding: StringifiedBigInt | null
  /** This is delayed in getAccount by 20 seconds on oasisscan and unknown on nexus. */
  delegations: StringifiedBigInt | null
  /** This is delayed in getAccount by 20 seconds on oasisscan and unknown on nexus. */
  total: StringifiedBigInt | null
  nonce: StringifiedBigInt
}

export interface Allowance {
  address: string
  amount: StringifiedBigInt
}

export interface Account extends BalanceDetails {
  address: string
  allowances?: Allowance[]
}

/* --- STATE --- */
export interface AccountState extends Account {
  loading: boolean
  accountError?: ErrorPayload
  transactions: Transaction[]
  transactionsError?: ErrorPayload
  pendingTransactions: Record<NetworkType, Transaction[]>
}

export interface PendingTransactionPayload {
  networkType: NetworkType
  transaction: Transaction
}

export interface TransactionsLoadedPayload {
  transactions: Transaction[]
  networkType: NetworkType
}
