import { AddressBox } from 'app/components/AddressBox'
import { Header } from 'app/components/Header'
import { AmountFormatter } from 'app/components/AmountFormatter'
import { ResponsiveGridRow } from 'app/components/ResponsiveGridRow'
import { formatCommissionPercent } from 'app/lib/helpers'
import { ValidatorStatus } from 'app/pages/StakingPage/Features/ValidatorList/ValidatorStatus'
import { Validator, ValidatorDetails } from 'app/state/staking/types'
import { Box } from 'grommet/es6/components/Box'
import { Grid } from 'grommet/es6/components/Grid'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Spinner } from 'grommet/es6/components/Spinner'
import { Text } from 'grommet/es6/components/Text'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { CommissionBounds } from '../CommissionBounds'
import { ValidatorMediaInfo } from '../ValidatorMediaInfo'

interface ValidatorProps {
  validator: Validator
  details: ValidatorDetails | null
}

export const ValidatorInformations = (props: ValidatorProps) => {
  const { validator, details } = props
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <>
      <Box
        align="center"
        direction="row"
        justify={isMobile ? 'between' : 'start'}
        gap={isMobile ? 'none' : 'medium'}
      >
        {validator.name && (
          <Header level="2" margin={{ bottom: 'none', top: 'none' }} data-testid="validator-item-name">
            {validator.name}
          </Header>
        )}
        {validator.media && (
          <Box direction="row">
            <ValidatorMediaInfo mediaInfo={validator.media} />
          </Box>
        )}
      </Box>
      <Text size={isMobile ? 'small' : 'medium'}>
        <AddressBox address={validator!.address} trimMobile />
      </Text>
      {/* Validator details */}
      <Grid
        columns={isMobile ? ['auto'] : ['auto', 'flex']}
        gap={{ column: 'medium', row: isMobile ? 'xxsmall' : 'none' }}
        fill={false}
        pad={{ vertical: 'small' }}
      >
        <ResponsiveGridRow label={t('validator.rank', 'Rank')} value={validator.rank} />
        <ResponsiveGridRow
          label={t('validator.totalEscrow', 'Total escrow')}
          value={<AmountFormatter amount={validator.escrow} size="inherit" />}
        />
        <ResponsiveGridRow
          label={t('validator.commission', 'Commission')}
          value={`${
            validator.current_rate !== undefined ? formatCommissionPercent(validator.current_rate) : 'Unknown'
          } %`}
        />
        <ResponsiveGridRow
          label={t('validator.commissionBounds.label', 'Commission bounds')}
          value={details ? <CommissionBounds bounds={details?.scheduledCommissionBounds} /> : <Spinner />}
        />
        <ResponsiveGridRow
          label={t('validator.status', 'Status')}
          value={<ValidatorStatus status={validator.status} showLabel={true}></ValidatorStatus>}
        />
      </Grid>
    </>
  )
}
