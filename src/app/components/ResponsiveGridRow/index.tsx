import { Box, Text } from 'grommet'
import React, { memo } from 'react'

interface ResponsiveGridRowProps {
  label: React.ReactNode
  value: React.ReactNode
}

export const ResponsiveGridRow = memo(({ label, value }: ResponsiveGridRowProps) => {
  return (
    <>
      <Box>
        <Text weight="bold">{label}</Text>
      </Box>
      <Box direction="row">{value}</Box>
    </>
  )
})
