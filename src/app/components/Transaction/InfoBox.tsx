import { Box, Text } from 'grommet'
import * as React from 'react'

interface DetailProps {
  icon?: React.ReactNode
  label: string
  value: string | React.ReactNode
}

export function InfoBox(props: DetailProps) {
  return (
    <Box direction="row" gap="small" hoverIndicator={{ color: 'background-contrast' }} pad="medium">
      {props.icon && (
        <Box fill="vertical" align="center" justify="center" alignSelf="center" pad={{ right: 'xsmall' }}>
          {props.icon}
        </Box>
      )}
      <Box justify="center">
        <Text weight="bold">{props.label}</Text>
        <Text>{props.value}</Text>
      </Box>
    </Box>
  )
}
