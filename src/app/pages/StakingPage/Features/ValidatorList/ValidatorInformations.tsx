import { AddressBox } from 'app/components/AddressBox'
import { AmountFormatter } from 'app/components/AmountFormatter'
import { ResponsiveGridRow } from 'app/components/ResponsiveGridRow'
import { ValidatorStatus } from 'app/pages/StakingPage/Features/ValidatorList/ValidatorStatus'
import { Validator, ValidatorDetails } from 'app/state/staking/types'
import { Box, Grid, Heading, ResponsiveContext, Spinner } from 'grommet'
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
  const size = useContext(ResponsiveContext)

  return (
    <>
      <Box direction="row-responsive" gap={size !== 'small' ? 'medium' : 'none'}>
        {validator.name && (
          <Heading size="small" margin={{ bottom: 'none', top: 'none' }} data-testid="validator-item-name">
            {validator.name}
          </Heading>
        )}
        {validator.media && (
          <Box direction="row">
            <ValidatorMediaInfo mediaInfo={validator.media} />
          </Box>
        )}
      </Box>
      <AddressBox address={validator!.address} />
      {/* Validator details */}
      <Grid
        columns={size !== 'small' ? ['auto', 'flex'] : ['auto']}
        gap={{ column: 'small', row: 'xsmall' }}
        fill={false}
        pad={{ top: 'small' }}
      >
        <ResponsiveGridRow label={t('validator.rank', 'Rank')} value={`#${validator.rank}`} />
        <ResponsiveGridRow
          label={t('validator.totalEscrow', 'Total escrow')}
          value={<AmountFormatter amount={validator.escrow} />}
        />
        <ResponsiveGridRow
          label={t('validator.commission', 'Commission')}
          value={`${validator.current_rate !== undefined ? validator.current_rate * 100 : 'Unknown'} %`}
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
