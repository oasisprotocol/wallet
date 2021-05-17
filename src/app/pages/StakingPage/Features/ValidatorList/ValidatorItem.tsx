import { AddEscrowForm } from 'app/components/AddEscrowForm'
import { Validator, ValidatorDetails } from 'app/state/staking/types'
import { Box } from 'grommet'
import React from 'react'

import { ValidatorInformations } from './ValidatorInformations'

interface ValidatorProps {
  data: Validator
  details: ValidatorDetails | null
  walletIsOpen: boolean
}
export const ValidatorItem = (props: ValidatorProps) => {
  const isWalletOpen = props.walletIsOpen
  const validator = props.data
  const details = props.details

  return (
    <Box pad="medium" background="background-contrast" data-testid="validator-item">
      <ValidatorInformations validator={validator} details={details} />
      {isWalletOpen && <AddEscrowForm validatorAddress={validator.address} />}
    </Box>
  )
}
