/* --- STATE --- */

import { NetworkType } from 'app/state/network/types'
import { ErrorPayload } from 'types/errors'
import { StringifiedBigInt } from 'types/StringifiedBigInt'

export interface Validator {
  address: string
  name?: string
  nodeAddress: string
  escrow: StringifiedBigInt
  status: 'active' | 'inactive' | 'unknown'
  rank: number
  media?: ValidatorMediaInfo
  current_rate?: number
  current_commission_bound?: CommissionBound
}

export interface Validators {
  timestamp: number
  network: NetworkType
  list: Validator[]
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
  logotype?: string
}

export interface Delegation {
  validator?: Validator
  amount: StringifiedBigInt
  shares: StringifiedBigInt
  validatorAddress: string
}

export interface DebondingDelegation extends Delegation {
  epoch: number
}

export interface StakingState {
  /** List of all the validators */
  validators: Validators | null

  /** Error from last attempt to update our list of validators */
  updateValidatorsError?: ErrorPayload

  /** List of active delegations for the selected account */
  delegations: Delegation[] | null

  /** List of debonding delegations for the selected account */
  debondingDelegations: DebondingDelegation[] | null

  /** Error from fetching delegations */
  updateDelegationsError?: ErrorPayload

  /** Addresss of the selected validator */
  selectedValidator?: string | null

  /** Lazy-loaded validator details (commission bounds and rates schedules) */
  selectedValidatorDetails: ValidatorDetails | null

  loading: boolean
}
