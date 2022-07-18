import { selectActiveDelegations } from 'app/state/staking/selectors'
import { Box, Heading } from 'grommet'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DelegationList } from '.'

export const ActiveDelegationList = () => {
  const { t } = useTranslation()
  const delegations = useSelector(selectActiveDelegations)
  return (
    <Box pad="medium" background="background-front">
      <Heading margin="none" size="small">
        {t('delegations.activeDelegations', 'Active delegations')}
      </Heading>
      <DelegationList type="active" delegations={delegations ?? []} />
    </Box>
  )
}
