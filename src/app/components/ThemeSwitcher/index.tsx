/**
 *
 * ThemeSwitcher
 *
 */
import { Moon, Sun } from 'grommet-icons/icons'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useThemeSlice } from 'styles/theme/slice'
import { selectTheme } from 'styles/theme/slice/selectors'

import { SidebarButton } from '../Sidebar'

interface Props {}

export const ThemeSwitcher = memo((props: Props) => {
  const { t } = useTranslation()
  const themeActions = useThemeSlice().actions
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()

  const modes = {
    light: {
      icon: <Moon />,
      label: t('theme.darkMode', 'Dark mode'),
    },
    dark: {
      icon: <Sun />,
      label: t('theme.ligthMode', 'Light mode'),
    },
  }

  const currentMode = modes[theme]
  const switchTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    dispatch(themeActions.changeTheme(newTheme))
  }

  return <SidebarButton icon={currentMode.icon} label={currentMode.label} onClick={switchTheme} />
})
