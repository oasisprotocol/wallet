import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import * as React from 'react'

interface Props {
  color: 'status-error' | 'status-warning' | 'status-ok'
  children: React.ReactNode
}

export function AlertBox(props: Props) {
  return (
    <Box
      border={{
        color: props.color,
        side: 'left',
        size: '3px',
      }}
      background={{
        color: props.color,
        opacity: 'weak',
      }}
      pad={{ horizontal: 'small', vertical: 'xsmall' }}
    >
      <Text weight="bold">{props.children}</Text>
    </Box>
  )
}
