/**
 *
 * ThemeSwitcher
 *
 */
import { Moon } from 'grommet-icons/es6/icons/Moon'
import { Sun } from 'grommet-icons/es6/icons/Sun'
import { FormField } from 'grommet/es6/components/FormField'
import { Select } from 'grommet/es6/components/Select'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { themeActions } from 'styles/theme/slice'
import { selectTheme } from 'styles/theme/slice/selectors'
import { SelectIconWrapper } from '../SelectIconWrapper'
import { SidebarButton } from '../Sidebar'

interface Props {}

export const ThemeSwitcher = memo((props: Props) => {
  const { t } = useTranslation()
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()

  const modes = {
    light: {
      icon: <Moon />,
      label: t('theme.darkMode', 'Dark mode'),
    },
    dark: {
      icon: <Sun />,
      label: t('theme.lightMode', 'Light mode'),
    },
  }

  const currentMode = modes[theme]
  const switchTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    dispatch(themeActions.changeTheme(newTheme))
  }

  return <SidebarButton icon={currentMode.icon} label={currentMode.label} onClick={switchTheme} />
})

export const ThemeSelect = () => {
  const { t } = useTranslation()
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()
  const themeOptions = [
    {
      value: 'light',
      label: t('theme.lightMode', 'Light mode'),
    },
    {
      value: 'dark',
      label: t('theme.darkMode', 'Dark mode'),
    },
  ]

  return (
    <FormField label={t('theme.title', 'Theme')} contentProps={{ border: false }}>
      <SelectIconWrapper icon={theme === 'light' ? <Sun /> : <Moon />}>
        <Select
          id="theme"
          name="theme"
          labelKey="label"
          valueKey={{ key: 'value', reduce: true }}
          value={theme}
          style={{ paddingLeft: '50px' }}
          options={themeOptions}
          onChange={({ option }) => dispatch(themeActions.changeTheme(option.value))}
        />
      </SelectIconWrapper>
    </FormField>
  )
}
