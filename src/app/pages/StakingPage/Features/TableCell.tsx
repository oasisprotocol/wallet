/**
 *
 * ExpandableRow
 *
 * Helper component for react-data-table-component custom cells
 *
 * react-data-table-component handles expandableRows correctly only for text nodes
 * or it requires to apply data-tag="allowRowEvents" to the innermost element which is hard to control
 */

import { Box } from 'grommet/es6/components/Box'
import { FC, ReactNode } from 'react'

interface ExpandableCellProps {
  children: ReactNode
  onClick: () => void
}

export const ExpandableCell: FC<ExpandableCellProps> = ({ children, onClick }) => {
  return (
    <Box onClick={onClick} style={{ display: 'inline', boxShadow: 'none' }}>
      {children}
    </Box>
  )
}
