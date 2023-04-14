import React from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { StatusCritical } from 'grommet-icons/es6/icons/StatusCritical'
import { StatusGood } from 'grommet-icons/es6/icons/StatusGood'
import { StatusUnknown } from 'grommet-icons/es6/icons/StatusUnknown'
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
    unknown: () => ({
      icon: <StatusUnknown color="status-critical" />,
      label: t('validator.statusUnknown', 'Unknown'),
    }),
  }

  const getMapped = mapStatus[props.status] ?? mapStatus.unknown
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
