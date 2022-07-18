import { Transaction } from 'app/state/transaction/types'
import { ErrorPayload } from 'types/errors'

export interface BalanceDetails {
  available: number | null
  debonding: number | null
  delegations: number | null
  total: number | null
}

export interface Account extends BalanceDetails {
  address: string
}

/* --- STATE --- */
export interface AccountState extends Account {
  loading: boolean
  accountError?: ErrorPayload
  transactions: Transaction[]
  transactionsError?: ErrorPayload
}
