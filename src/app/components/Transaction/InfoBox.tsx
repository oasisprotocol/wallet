import { Box, Text } from 'grommet'
import * as React from 'react'
import type { Icon } from 'grommet-icons/icons'
import copy from 'copy-to-clipboard'
import { trimLongString } from '../ShortAddress'

interface InfoBoxProps {
  copyToClipboard?: boolean
  icon: Icon
  label: string
  value: string
  trimValue?: boolean
}

export function InfoBox({ copyToClipboard, icon: IconComponent, label, trimValue, value }: InfoBoxProps) {
  return (
    <Box
      direction="row"
      gap="small"
      hoverIndicator={{ color: 'background-contrast' }}
      pad={{ horizontal: 'small', vertical: 'small' }}
      onClick={copyToClipboard ? () => copy(value) : undefined}
    >
      <Box fill="vertical" align="center" justify="center" alignSelf="center" pad={{ right: 'xsmall' }}>
        <IconComponent color="brand" size="20px" />
      </Box>

      <Box justify="center">
        <Text weight="bold">{label}</Text>
        <Text>{trimValue ? trimLongString(value) : value}</Text>
      </Box>
    </Box>
  )
}
