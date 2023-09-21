import { useContext } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { UpdatePassword } from './UpdatePassword'
import { layerOverlayMinHeight } from './../layer'

export const Profile = () => {
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <Box flex="grow" height={{ min: isMobile ? 'auto' : layerOverlayMinHeight }} pad={{ vertical: 'medium' }}>
      <UpdatePassword />
    </Box>
  )
}
