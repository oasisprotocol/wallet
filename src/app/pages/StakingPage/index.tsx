/**
 *
 * StakingPage
 *
 */
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { useStakingSlice } from 'app/state/staking'
import { Box } from 'grommet'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { ValidatorList } from './Features/ValidatorList'

interface Props {}

interface StakingPageParams {
  address: string
}

export function StakingPage(props: Props) {
  const stakeActions = useStakingSlice().actions
  const { address } = useParams<StakingPageParams>()
  const dispatch = useDispatch()

  const selectedNetwork = useSelector(selectSelectedNetwork)

  React.useEffect(() => {
    dispatch(stakeActions.fetchAccount(address))
    // dispatch(stakeActions.fetchAccount(address))
    // return () => {
    //   dispatch(stakeActions.clearAccount())
    // }
  }, [dispatch, stakeActions, address, selectedNetwork])

  return (
    <Box>
      <ValidatorList />
    </Box>
  )
}
