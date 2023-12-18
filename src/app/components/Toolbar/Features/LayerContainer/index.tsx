import { useContext, ReactNode } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Close } from 'grommet-icons/es6/icons/Close'
import { ResponsiveLayer } from '../../../ResponsiveLayer'
import { layerOverlayMinHeight } from '../layer'

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
      position="center"
      style={{
        width: '100%',
        maxWidth: isMobile ? 'none' : '760px',
        minHeight: `min(${layerOverlayMinHeight}, 90dvh)`,
      }}
    >
      <Box flex="grow" margin={{ top: 'small', bottom: 'medium', horizontal: 'medium' }}>
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
