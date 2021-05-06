/* --- STATE --- */
export interface Validator {
  name?: string
  address: string
  escrow?: number
  status: string
  rank: number
  fee: number
  media?: ValidatorMediaInfo
}

export interface CommissionBounds {
  lower: number
  upper: number
  epochStart: number
  epochEnd?: number
}

export interface ValidatorDetails {
  currentCommissionBounds?: CommissionBounds
  scheduledCommissionBounds?: CommissionBounds[]
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
