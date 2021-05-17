/**
 *
 * ResponsiveGridRow
 *
 */
import { Box, Text } from 'grommet'
import React, { memo } from 'react'

interface Props {
  label: string | React.ReactNode
  value: string | React.ReactNode
}

export const ResponsiveGridRow = memo((props: Props) => {
  return (
    <>
      <Box>
        <Text weight="bold">{props.label}</Text>
      </Box>
      <Box>{props.value}</Box>
    </>
  )
})
