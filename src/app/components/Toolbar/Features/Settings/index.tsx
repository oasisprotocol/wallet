import { useContext } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { ThemeSelect } from 'app/components/ThemeSwitcher'
import { LanguageSelect } from 'app/components/LanguageSelect'
import { layerOverlayMinHeight } from '../layer'

export const Settings = () => {
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <Box height={{ min: isMobile ? 'auto' : layerOverlayMinHeight }} gap="small">
      <LanguageSelect />
      <ThemeSelect />
    </Box>
  )
}
