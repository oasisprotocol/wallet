import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import * as React from 'react'

export type AlertBoxColor = 'status-error' | 'status-warning' | 'status-ok' | 'status-ok-weak'

interface Props {
  color: AlertBoxColor
  children: React.ReactNode
}

const mapColor = {
  'status-error': {
    color: 'status-error',
    background: 'status-error-background',
  },
  'status-warning': {
    color: 'status-warning',
    background: 'status-warning-background',
  },
  'status-ok': {
    color: 'status-ok',
    background: 'status-ok-background',
  },
  'status-ok-weak': {
    color: 'status-ok-weak',
    background: 'status-ok-weak-background',
  },
}

export function AlertBox(props: Props) {
  return (
    <Box
      border={{
        color: mapColor[props.color].color,
        side: 'left',
        size: '3px',
      }}
      background={{
        color: mapColor[props.color].background,
      }}
      pad={{ horizontal: 'small', vertical: 'small' }}
    >
      <Text weight="bold" size="12px">
        {props.children}
      </Text>
    </Box>
  )
}
