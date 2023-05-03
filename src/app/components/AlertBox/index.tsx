import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import * as React from 'react'

export type AlertBoxStatus = 'error' | 'warning' | 'ok' | 'ok-weak'

interface Props {
  status: AlertBoxStatus
  center?: boolean
  /** Example `icon={<Info size="20px" color="currentColor" />}` */
  icon?: React.ReactNode
  children: React.ReactNode
}

const mapStatus = {
  error: {
    color: 'status-error',
    background: 'status-error-background',
  },
  warning: {
    color: 'status-warning',
    background: 'status-warning-background',
  },
  ok: {
    color: 'status-ok',
    background: 'status-ok-background',
  },
  'ok-weak': {
    color: 'status-ok-weak',
    background: 'status-ok-weak-background',
  },
}

export function AlertBox(props: Props) {
  return (
    <Box
      border={{
        color: mapStatus[props.status].color,
        side: 'left',
        size: '3px',
      }}
      background={{
        color: mapStatus[props.status].background,
      }}
      pad={{ horizontal: 'small' }}
    >
      <Text weight="bold" size="12px" style={{ lineHeight: '34px' }}>
        <Box direction="row" gap="small" align="center" justify={props.center ? 'center' : 'start'}>
          {props.icon && <Text color={mapStatus[props.status].color}>{props.icon}</Text>}
          <span>{props.children}</span>
        </Box>
      </Text>
    </Box>
  )
}
