import { Header } from 'app/components/Header'
import { selectActiveDelegations } from 'app/state/staking/selectors'
import { Box } from 'grommet/es6/components/Box'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DelegationList } from '.'

export const ActiveDelegationList = () => {
  const { t } = useTranslation()
  const delegations = useSelector(selectActiveDelegations)
  return (
    <Box pad="medium" background="background-front">
      <Header>{t('delegations.activeDelegations', 'Active delegations')}</Header>
      <DelegationList type="active" delegations={delegations ?? []} />
    </Box>
  )
}
