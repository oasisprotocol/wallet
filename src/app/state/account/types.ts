import { Transaction } from 'app/state/transaction/types'
import { ErrorPayload } from 'types/errors'
import { StringifiedBigInt } from 'types/StringifiedBigInt'

export interface BalanceDetails {
  available: StringifiedBigInt | null
  debonding: StringifiedBigInt | null
  delegations: StringifiedBigInt | null
  total: StringifiedBigInt | null
}

export interface Allowance {
  address: string
  amount: string
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
