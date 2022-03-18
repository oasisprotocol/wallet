import React from 'react'
import { Box, Text } from 'grommet'
import { StatusCritical, StatusGood } from 'grommet-icons/icons'
import { useTranslation } from 'react-i18next'
import { Validator } from 'app/state/staking/types'

interface Props {
  status: Validator['status']
  showLabel: boolean
}
export const ValidatorStatus = (props: Props) => {
  const { t } = useTranslation()

  const mapStatus: { [status in Validator['status']]: () => { icon: React.ReactElement; label: string } } = {
    active: () => ({
      icon: <StatusGood color="status-ok" />,
      label: t('validator.statusActive', 'Active'),
    }),
    inactive: () => ({
      icon: <StatusCritical color="status-critical" />,
      label: t('validator.statusInactive', 'Inactive'),
    }),
  }

  const getMapped = mapStatus[props.status] ?? mapStatus.inactive
  const mapped = getMapped()

  if (props.showLabel) {
    return (
      <Box direction="row" align="center" gap="xxsmall">
        {mapped.icon} <Text>{mapped.label}</Text>
      </Box>
    )
  } else {
    return mapped.icon
  }
}
