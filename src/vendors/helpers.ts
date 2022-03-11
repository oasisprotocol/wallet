import { Validator } from 'app/state/staking/types'

const ValidatorStatusPriority = {
  active: 1,
  unknown: 2,
  inactive: 3,
}

export const sortByStatus = (a: Validator, b: Validator) =>
  ValidatorStatusPriority[a.status] - ValidatorStatusPriority[b.status]
