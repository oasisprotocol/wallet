import { OperationsRow } from 'vendors/explorer'

export interface BalanceDetails {
  total: number
  debonding: number
  escrow: number
  available: number
  delegations: number
}

export interface Account {
  address: string
  escrow_debonding_balance: number
  escrow_balance: number
  liquid_balance: number
}

/* --- STATE --- */
export interface AccountState extends Account {
  loading: boolean
  accountError: string | null
  transactions: OperationsRow[]
  transactionsError: string | null
}
