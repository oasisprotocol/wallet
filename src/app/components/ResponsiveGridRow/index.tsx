import { Box, Text } from 'grommet'
import React, { memo } from 'react'

interface ResponsiveGridRowProps {
  label: React.ReactNode
  value: React.ReactNode
  withSeparator?: boolean
}

export const ResponsiveGridRow = memo(({ label, value, withSeparator }: ResponsiveGridRowProps) => {
  return (
    <>
      <Box>
        <Text weight="bold">{label}</Text>
      </Box>
      {withSeparator ? (
        <Box
          margin={{ bottom: 'xsmall' }}
          pad={{ bottom: 'small' }}
          border={{ color: 'background-front-border', side: 'bottom', size: 'xsmall' }}
          responsive={false}
        >
          {value}
        </Box>
      ) : (
        <Box direction="row">{value}</Box>
      )}
    </>
  )
})
