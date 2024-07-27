/**
 *
 * ThemeSwitcher
 *
 */
import { Moon } from 'grommet-icons/es6/icons/Moon'
import { Sun } from 'grommet-icons/es6/icons/Sun'
import { System } from 'grommet-icons/es6/icons/System'
import { memo } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { themeActions } from 'styles/theme/slice'
import { selectTheme } from 'styles/theme/slice/selectors'
import { SelectWithIcon } from '../SelectWithIcon'
import { SidebarButton } from '../Sidebar'
import { getTargetTheme } from 'styles/theme/utils'

interface Props {}

const getThemesIcons = (t: TFunction, size?: string) => ({
  light: <Sun aria-label={t('theme.lightMode', 'Light mode')} size={size} />,
  dark: <Moon aria-label={t('theme.darkMode', 'Dark mode')} size={size} />,
  system: <System aria-label={t('theme.system', 'System')} size={size} />,
})

export const ThemeSwitcher = memo((props: Props) => {
  const { t } = useTranslation()
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()
  const icons = getThemesIcons(t)
  const modes = {
    light: {
      icon: icons.dark,
      label: t('theme.darkMode', 'Dark mode'),
    },
    dark: {
      icon: icons.light,
      label: t('theme.lightMode', 'Light mode'),
    },
  }
  const currentMode = modes[getTargetTheme(theme)]
  const switchTheme = () => {
    const newTheme = getTargetTheme(theme) === 'dark' ? 'light' : 'dark'
    dispatch(themeActions.changeTheme(newTheme))
  }

  return <SidebarButton icon={currentMode.icon} label={currentMode.label} onClick={switchTheme} />
})

export const ThemeSelect = () => {
  const { t } = useTranslation()
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()
  const icons = getThemesIcons(t, '24px')
  const themeOptions: { value: 'dark' | 'light' | 'system'; label: string }[] = [
    {
      value: 'light',
      label: t('theme.lightMode', 'Light mode'),
    },
    {
      value: 'dark',
      label: t('theme.darkMode', 'Dark mode'),
    },
    {
      value: 'system',
      label: t('theme.system', 'System'),
    },
  ]

  return (
    <SelectWithIcon
      label={t('theme.title', 'Theme')}
      id="theme"
      name="theme"
      icon={icons[theme]}
      value={theme}
      options={themeOptions}
      onChange={option => dispatch(themeActions.changeTheme(option))}
    />
  )
}
