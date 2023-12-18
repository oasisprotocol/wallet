import { Box } from 'grommet/es6/components/Box'
import { ThemeSelect } from 'app/components/ThemeSwitcher'
import { LanguageSelect } from 'app/components/LanguageSelect'

export const Settings = () => {
  return (
    <Box gap="small">
      <LanguageSelect />
      <ThemeSelect />
    </Box>
  )
}
