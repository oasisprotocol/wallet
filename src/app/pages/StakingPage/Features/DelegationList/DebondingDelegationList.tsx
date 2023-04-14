import { Header } from 'app/components/Header'
import { selectDebondingDelegations } from 'app/state/staking/selectors'
import { Box } from 'grommet/es6/components/Box'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DelegationList } from '.'

export const DebondingDelegationList = () => {
  const { t } = useTranslation()
  const delegations = useSelector(selectDebondingDelegations)
  return (
    <Box pad="medium" background="background-front">
      <Header>{t('delegations.debondingDelegations', 'Debonding delegations')}</Header>
      <DelegationList type="debonding" delegations={delegations ?? []} />
    </Box>
  )
}
