import { selectDebondingDelegations } from 'app/state/staking/selectors'
import { Box, Heading } from 'grommet'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DelegationList } from '.'

export const DebondingDelegationList = () => {
  const { t } = useTranslation()
  const delegations = useSelector(selectDebondingDelegations)
  return (
    <Box pad="medium" background="background-front">
      <Heading margin="none" size="small">
        {t('delegations.debondingDelegations', 'Debonding delegations')}
      </Heading>
      <DelegationList type="debonding" delegations={delegations} />
    </Box>
  )
}
