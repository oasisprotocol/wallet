import { useContext, ReactNode } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Close } from 'grommet-icons/es6/icons/Close'
import { ResponsiveLayer } from '../../../ResponsiveLayer'

interface LayerContainerProps {
  animation?: boolean
  children: ReactNode
  hideLayer: () => void
}

export const LayerContainer = ({ animation, children, hideLayer }: LayerContainerProps) => {
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <ResponsiveLayer
      onClickOutside={hideLayer}
      onEsc={hideLayer}
      animation={animation ? 'slide' : 'none'}
      background="background-front"
      modal
      position="top"
      margin={isMobile ? 'none' : 'xlarge'}
    >
      <Box
        margin={{ top: 'small', bottom: 'medium', horizontal: 'medium' }}
        width={isMobile ? 'auto' : '700px'}
      >
        <Box align="end">
          <Button
            data-testid="close-settings-modal"
            onClick={hideLayer}
            secondary
            icon={<Close size="18px" />}
          />
        </Box>
        {children}
      </Box>
    </ResponsiveLayer>
  )
}
