import { Transaction } from 'app/state/transaction/types'
import { ErrorPayload } from 'types/errors'

export interface BalanceDetails {
  total: number
  debonding: number
  available: number
  delegations: number
}

export interface Account {
  address: string
  liquid_balance: number
}

/* --- STATE --- */
export interface AccountState extends Account {
  loading: boolean
  accountError?: ErrorPayload
  transactions: Transaction[]
  transactionsError?: ErrorPayload
}
