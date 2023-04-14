import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
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
