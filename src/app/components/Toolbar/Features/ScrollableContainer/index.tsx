import { useContext, ReactNode } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { layerScrollableAreaHeight } from '../layer'

const spaceForFocusIndicator = '2px'

interface ScrollableContainerProps {
  children: ReactNode
}

export const ScrollableContainer = ({ children }: ScrollableContainerProps) => {
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <Box
      gap="small"
      pad={{ right: 'small', left: spaceForFocusIndicator }}
      overflow={{ vertical: 'auto' }}
      style={{ maxHeight: layerScrollableAreaHeight }}
      margin={{ bottom: isMobile ? 'large' : 'none', left: `-${spaceForFocusIndicator}` }}
    >
      {children}
    </Box>
  )
}
