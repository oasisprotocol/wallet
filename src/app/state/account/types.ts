import { Transaction } from 'app/state/transaction/types'
import { ErrorPayload } from 'types/errors'
import { StringifiedBigInt } from 'types/StringifiedBigInt'

export interface BalanceDetails {
  available: StringifiedBigInt | null
  /** This is delayed in getAccount by 20 seconds on oasisscan and 5 seconds on oasismonitor. */
  debonding: StringifiedBigInt | null
  /** This is delayed in getAccount by 20 seconds on oasisscan and 5 seconds on oasismonitor. */
  delegations: StringifiedBigInt | null
  /** This is delayed in getAccount by 20 seconds on oasisscan and 5 seconds on oasismonitor. */
  total: StringifiedBigInt | null
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
}
