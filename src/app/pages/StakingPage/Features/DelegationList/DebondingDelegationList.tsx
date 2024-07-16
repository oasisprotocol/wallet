import { selectDebondingDelegations } from 'app/state/staking/selectors'
import { Box } from 'grommet/es6/components/Box'
import { useSelector } from 'react-redux'

import { DelegationList } from '.'
import { StakeSubnavigation } from '../../../AccountPage/Features/StakeSubnavigation'

export const DebondingDelegationList = () => {
  const delegations = useSelector(selectDebondingDelegations)
  return (
    <>
      <StakeSubnavigation />
      <Box as="section" data-testid="debonding-delegations">
        <Box pad="medium" background="background-front">
          <DelegationList type="debonding" delegations={delegations ?? []} />
        </Box>
      </Box>
    </>
  )
}
