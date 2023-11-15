import { AddEscrowForm } from 'app/components/AddEscrowForm'
import { Validator, ValidatorDetails } from 'app/state/staking/types'
import { Box } from 'grommet/es6/components/Box'
import React from 'react'

import { ValidatorInformations } from './ValidatorInformations'

interface ValidatorProps {
  data: Validator
  details: ValidatorDetails | null
  isAddressInWallet: boolean
}
export const ValidatorItem = (props: ValidatorProps) => {
  const isAddressInWallet = props.isAddressInWallet
  const validator = props.data
  const details = props.details

  return (
    <Box pad={{ vertical: 'medium' }} data-testid="validator-item">
      <Box style={{ maxWidth: '85vw' }}>
        <ValidatorInformations validator={validator} details={details} />
        {isAddressInWallet && (
          <AddEscrowForm
            validatorAddress={validator.address}
            validatorStatus={validator.status}
            validatorRank={validator.rank}
          />
        )}
      </Box>
    </Box>
  )
}
