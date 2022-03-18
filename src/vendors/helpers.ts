import { Validator } from 'app/state/staking/types'

const ValidatorStatusPriority = {
  active: 1,
  inactive: 2,
}

export const sortByStatus = (a: Validator, b: Validator) =>
  ValidatorStatusPriority[a.status] - ValidatorStatusPriority[b.status]
