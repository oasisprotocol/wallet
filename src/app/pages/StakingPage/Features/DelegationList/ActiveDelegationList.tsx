import { selectActiveDelegations } from 'app/state/staking/selectors'
import { Box } from 'grommet/es6/components/Box'
import React from 'react'
import { useSelector } from 'react-redux'

import { DelegationList } from '.'
import { StakeSubnavigation } from '../../../AccountPage/Features/StakeSubnavigation'

export const ActiveDelegationList = () => {
  const delegations = useSelector(selectActiveDelegations)
  return (
    <>
      <StakeSubnavigation />
      <Box as="section" data-testid="active-delegations">
        <Box pad="medium" background="background-front">
          <DelegationList type="active" delegations={delegations ?? []} />
        </Box>
      </Box>
    </>
  )
}
