import { useContext, ReactNode } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { mobileScrollableAreaHeight, layerScrollableAreaHeight } from '../layer'

interface ScrollableContainerProps {
  children: ReactNode
}

export const ScrollableContainer = ({ children }: ScrollableContainerProps) => {
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <Box
      gap="small"
      pad={{ vertical: 'medium', right: 'small' }}
      overflow={{ vertical: 'auto' }}
      height={isMobile ? mobileScrollableAreaHeight : layerScrollableAreaHeight}
    >
      {children}
    </Box>
  )
}
