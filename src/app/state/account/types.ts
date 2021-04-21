import { AccountsRow, OperationsRow } from 'vendors/explorer'

export interface BalanceDetails {
  total: number
  debonding: number
  escrow: number
  available: number
  delegations: number
}

/* --- STATE --- */
export interface AccountState extends AccountsRow {
  loading: boolean
  transactions: OperationsRow[]
}
