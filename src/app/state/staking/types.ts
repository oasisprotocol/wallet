/* --- STATE --- */
import { ValidatorCommissionSchedule } from '../../../vendors/explorer'

export interface Validator {
  name?: string
  address: string
  escrow?: number
  status: string
  rank: number
  media?: ValidatorMediaInfo
  commission_schedule: ValidatorCommissionSchedule
  current_rate?: Rate
  current_commission_bound?: CommissionBound
}

export interface Rate {
  epochStart: number
  epochEnd?: number
  rate: number
}

export interface CommissionBound {
  lower: number
  upper: number
  epochStart: number
  epochEnd?: number
}

export interface ValidatorDetails {
  currentCommissionBounds?: CommissionBound
  scheduledCommissionBounds?: CommissionBound[]
  nextCommission?: {
    fee: number
    epochStart: number
  }
}
export interface ValidatorMediaInfo {
  website_link?: string
  email_address?: string
  twitter_acc?: string
  tg_chat?: string
}

export interface Delegation {
  validator?: Validator
  amount: string
  shares: string
  validatorAddress: string
}

export interface DebondingDelegation extends Delegation {
  epoch: number
}

export interface StakingState {
  /** List of all the validators */
  validators: Validator[]

  /** List of active delegations for the selected account */
  delegations: Delegation[]

  /** List of debonding delegations for the selected account */
  debondingDelegations: DebondingDelegation[]

  /** Addresss of the selected validator */
  selectedValidator?: string | null

  /** Lazy-loaded validator details (commission bounds and rates schedules) */
  selectedValidatorDetails: ValidatorDetails | null

  loading: boolean
}
