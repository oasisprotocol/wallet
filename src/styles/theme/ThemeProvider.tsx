import { grommet, Grommet, ThemeType } from 'grommet'
import { deepMerge } from 'grommet/utils'
import * as React from 'react'
import { useSelector } from 'react-redux'

import { useThemeSlice } from './slice'
import { selectTheme } from './slice/selectors'

const defaultGrommetTheme: ThemeType = {
  button: {
    primary: {
      background: {
        dark: 'red',
        light: 'green',
      },
    },
    // default: {
    //   background: {
    //     dark: '#7D4CDB',
    //     light: '#7D4CDB',
    //   },
    // },
  },
  global: {
    colors: {
      oasisIndigo: '#310081',
      oasisMinty: '#4CD4A9',
      oasisLightGray: '#ececec',
      brand: {
        light: '#0092f6',
        dark: '#0092f6bb',
      },
      oasisBlue2: '#4db3f9',
      oasisBlue3: '#26a2f8',
      'status-ok': '#4cd4a9',
      'status-error': '#ff4212',
      'status-warning': '#f4ce4b',
      'background-oasis-blue': {
        dark: '#0f477b',
        light: '#0092f6',
      },
      neutral: {
        dark: '#310081FF',
        light: '#310081FF',
      },
      'neutral-2': {
        dark: '#0092f6bb',
        light: '#0092f6bb',
      },
      'background-back': {
        dark: '#1A1A2e',
        light: '#EFEFEF',
      },
      'background-front': {
        dark: '#16213e',
        light: '#FFFFFF',
      },
      'background-front-lighter': {
        dark: '#222938',
        light: '#FFFFFF',
      },
      'background-front-border': {
        dark: '#111111',
        light: '#EDEDED',
      },
      'background-contrast': {
        dark: '#FFFFFF08',
        light: '#11111108',
      },
      'background-custom': {
        dark: '#0E5265',
        light: '#00C8FF',
      },
      'component-toolbar': {
        dark: '#0f346088',
        light: '#26a2f844',
      },
      'component-sidebar': {
        dark: '#16213e',
        light: '#fafafa',
      },
    },
    font: {
      family: 'Rubik',
    },
  },
}
export const ThemeProvider = (props: { children: React.ReactChild }) => {
  useThemeSlice()

  const theme = deepMerge(grommet, defaultGrommetTheme)
  const mode = useSelector(selectTheme)

  return (
    <Grommet full theme={theme} themeMode={mode}>
      {React.Children.only(props.children)}
    </Grommet>
  )
}
