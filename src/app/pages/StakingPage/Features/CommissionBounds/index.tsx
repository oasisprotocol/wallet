/**
 *
 * CommisssionBounds
 *
 */
import { useNetworkSlice } from 'app/state/network'
import { selectEpoch } from 'app/state/network/selectors'
import { CommissionBound as ICommissionBounds } from 'app/state/staking/types'
import { Box, Text } from 'grommet'
import React, { memo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

interface CommissionBoundProps {
  bound: ICommissionBounds
}

const CommissionBound = memo((props: CommissionBoundProps) => {
  useNetworkSlice()
  const { t } = useTranslation()
  const epoch = useSelector(selectEpoch)

  const bound = props.bound
  const isCurrentBounds = epoch > bound.epochStart && (!bound.epochEnd || epoch < bound.epochEnd)

  const component = isCurrentBounds ? (
    <Trans
      i18nKey="validator.commissionBounds.current"
      t={t}
      defaults="<0>{{lowerBound}}% - {{upperBound}}%</0> at current Epoch {{epoch}}"
      components={[<Text weight="bold" />]}
      values={{ lowerBound: bound.lower * 100, upperBound: bound.upper * 100, epoch: epoch }}
    />
  ) : (
    <Trans
      i18nKey="validator.commissionBounds.future"
      t={t}
      defaults="{{lowerBound}}% - {{upperBound}}% starting from Epoch {{epoch}}"
      values={{ lowerBound: bound.lower * 100, upperBound: bound.upper * 100, epoch: bound.epochStart }}
    />
  )

  return (
    <Box>
      <Text>{component}</Text>
    </Box>
  )
})

interface Props {
  bounds?: ICommissionBounds[]
}

export const CommissionBounds = memo((props: Props) => {
  const { t } = useTranslation()

  if (props.bounds && props.bounds.length > 0) {
    const items = props.bounds
      // Always clone before sort so it doesn't mutate source
      .slice()
      .sort((a, b) => a.epochStart - b.epochStart)
      .map((b, i) => <CommissionBound bound={b} key={i} />)
    return <>{items}</>
  } else {
    return <>{t('validator.boundsNotSet', 'No bounds set (0% - 0%)')}</>
  }
})
