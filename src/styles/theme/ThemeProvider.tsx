import { Grommet } from 'grommet/es6/components/Grommet'
import { base as baseTheme, grommet, ThemeType } from 'grommet/es6/themes'
import { deepMerge } from 'grommet/es6/utils'
import * as React from 'react'
import { createTheme as dataTableCreateTheme } from 'react-data-table-component'
import { useSelector } from 'react-redux'

import { selectTheme } from './slice/selectors'
import { dataTableTheme } from './dataTableTheme'
import { css } from 'styled-components'
import { getTargetTheme } from './utils'
import { getInitialState as getInitialThemeState } from './slice'

/**
 * React-data-table by default sets its own background and text colors
 * we make sure that they do not override grommet's
 */
dataTableCreateTheme('blank', dataTableTheme)

const grommetCustomTheme: ThemeType = {
  anchor: {
    color: 'link',
  },
  button: {
    primary: {
      background: {
        dark: 'red',
        light: 'green',
      },
    },
    border: {
      radius: '4px',
    },
    badge: {
      size: { medium: '20px' },
      container: {
        extend: `
          margin-top: -10px;
          margin-right: -10px;
        `,
      },
    },
  },
  textInput: {
    extend: css`
      &::placeholder {
        font-size: 14px;
      }
    `,
  },
  textArea: {
    extend: css`
      &::placeholder {
        font-size: 14px;
      }
    `,
  },
  tip: {
    content: {
      // Default background is background-contrast, but we made that one transparent
      background: 'background-front',
      border: 'all',
      elevation: 'none',
    },
  },
  select: {
    container: {
      // Remove padding from selects with custom elements inside options.
      // Needed to match ParaTimeOption when displayed as value and as option
      extend: css`
        button > div:has(span *) {
          padding: 0;
        }
      `,
    },
  },
  global: {
    colors: {
      oasisIndigo: '#310081',
      oasisMinty: '#4CD4A9',
      oasisLightGray: '#ececec',
      brand: {
        dark: '#6EFFFA',
        light: '#0500e2',
      },
      oasisBlue2: '#4db3f9',
      oasisBlue3: '#26a2f8',
      grayMedium: {
        dark: '#d5d6d7',
        light: '#565b61',
      },
      link: 'brand',
      ticker: 'brand',
      focus: {
        dark: '#00A9FF',
        light: '#00A9FF',
      },
      active: 'rgba(183, 183, 183, 0.5)',
      'accent-1': 'focus',
      'brand-background-light': '#e3e8ed',
      'brand-white': '#f8f8f8',
      white: '#ffffff',
      'brand-blue': '#0500e2',
      'brand-light-blue': '#e8f5ff',
      'brand-gray-medium': '#d5d6d7',
      'brand-gray-extra-dark': '#06152b',
      'status-ok': '#2ad5ab',
      'status-warning': {
        dark: '#f3d45e',
        light: '#e1a809',
      },
      'status-error': '#d24c00',

      'alert-box-info': {
        dark: '#0500e2',
        light: '#0500e2',
      },
      'alert-box-info-background': {
        dark: '#d4ebff',
        light: '#d4ebff',
      },
      'alert-box-ok-weak': {
        dark: '#2ad5ab',
        light: '#2ad5ab',
      },
      'alert-box-ok-weak-background': {
        dark: '#17464b',
        light: '#c2f5ea',
      },
      'alert-box-ok': {
        dark: '#2ad5ab',
        light: '#c2f5ea',
      },
      'alert-box-ok-background': {
        dark: '#c2f5ea',
        light: '#2ad5ab',
      },
      'alert-box-warning': {
        dark: '#f3d45e',
        light: '#f0e8cb',
      },
      'alert-box-warning-background': {
        dark: '#f0e8cb',
        light: '#f3d45e',
      },
      'alert-box-warning-weak-background': {
        dark: '#f0e8cb',
        light: '#fcf1d0',
      },
      'alert-box-error': {
        dark: '#f26111',
        light: '#ffe7d9',
      },
      'alert-box-error-background': {
        dark: '#ffe7d9',
        light: '#f26111',
      },
      lightText: '#a3a3a3',
      neutral: {
        dark: '#310081FF',
        light: '#310081FF',
      },
      'neutral-2': {
        dark: '#0500e2bb',
        light: '#0500e2bb',
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
      'background-contrast-2': {
        dark: '#FFFFFF33',
        light: '#11111133',
      },
      'background-custom': {
        dark: '#0E5265',
        light: '#00C8FF',
      },
      'background-custom-2': {
        dark: '#6EFFFA',
        light: '#E8F5FF',
      },
      'component-toolbar': {
        dark: '#0f346088',
        light: '#26a2f844',
      },
      'component-sidebar': {
        dark: '#16213e',
        light: '#fafafa',
      },
      'successful-label': {
        dark: '#00fd79',
        light: '#3fa900',
      },
      'text-custom': {
        dark: '#16213E',
        light: '#31435A',
      },
      text: {
        dark: '#F8F8F8',
        light: '#16213E',
      },
      icon: 'currentColor',
    },
    font: {
      family: 'Rubik, sans-serif',
      size: '16px',
      height: '20px',
    },
    input: {
      padding: {
        horizontal: '5px',
        vertical: '12px',
      },
    },
    selected: {
      background: 'control',
    },
  },
  text: {
    medium: { size: '16px', height: '20px' },
  },
  paragraph: {
    medium: { size: '16px', height: '20px' },
  },
  heading: {
    level: {
      1: baseTheme.heading?.level?.['2'],
      2: baseTheme.heading?.level?.['3'],
      3: baseTheme.heading?.level?.['4'],
      4: baseTheme.heading?.level?.['5'],
      5: baseTheme.heading?.level?.['6'],
    },
  },
  notification: {
    toast: {
      time: 2000,
      container: {
        border: 'all',
        elevation: 'none',
      },
    },
  },
  tab: {
    color: 'text',
    active: {
      color: 'brand',
    },
    border: {
      side: 'bottom',
      color: 'transparent',
      active: {
        color: 'brand',
      },
    },
    margin: {
      horizontal: 'xsmall',
    },
  },
  tabs: {
    header: {
      alignSelf: 'start',
    },
    panel: {
      extend: props => css`
        padding-top: ${props.theme.global?.edgeSize?.medium};
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      `,
    },
    extend: css`
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      // Arrows displayed when overflowing should be smaller on small screens
      & > [role='tablist'] > button {
        padding-left: 0;
        padding-right: 0;

        svg {
          width: 14px;
          margin-top: -5px;
        }
      }
    `,
  },
  icon: {
    size: {
      medium: '20px',
    },
  },
  radioButton: {
    icon: {
      size: '20px',
    },
  },
  checkBox: {
    size: '20px',
    icon: {
      size: '20px',
    },
    toggle: {
      size: '40px',
      color: {
        dark: 'text',
        light: 'grayMedium',
      },
    },
    border: {
      color: 'text',
    },
    hover: {
      border: {
        color: 'focus',
      },
    },
    gap: '1.5ex',
    extend: css`
      font-size: 14px;
      line-height: 1.25;
    `,
  },
  layer: {
    /**
     * Replace 100vh with 100dvh in https://github.com/grommet/grommet/blob/9e1ef40/src/js/components/Layer/StyledLayer.js
     * to fix scrolling to bottom despite URL bar on phones. Note: doesn't reliably reproduce on dev server.
     */
    extend: props => {
      if (props.responsive && props.theme!.layer!.responsiveBreakpoint) {
        const breakpoint = props.theme!.global!.breakpoints![props.theme!.layer!.responsiveBreakpoint]!
        return css`
          @media only screen and (max-width: ${breakpoint.value}px) {
            min-height: 100dvh;
          }
        `
      }
      return css``
    },
    container: {
      extend: props => {
        if (props.responsive && props.theme!.layer!.responsiveBreakpoint) {
          const breakpoint = props.theme!.global!.breakpoints![props.theme!.layer!.responsiveBreakpoint]!
          return css`
            @media only screen and (max-width: ${breakpoint.value}px) {
              height: 100dvh;
            }
          `
        }
        return css``
      },
    },
  },
  grommet: {
    /**
     * Replace 100vh with 100dvh in https://github.com/grommet/grommet/blob/9e1ef40/src/js/components/Grommet/StyledGrommet.js
     * to fix scrolling to bottom despite URL bar on phones. Note: doesn't reliably reproduce on dev server.
     */
    extend: props => {
      if (props.full) {
        return css`
          height: 100dvh;
        `
      }
      return css``
    },
  },
}
export const ThemeProvider = (props: { children: React.ReactNode }) => {
  const theme = deepMerge(grommet, grommetCustomTheme)
  const mode = useSelector(selectTheme)

  return (
    <Grommet theme={theme} themeMode={getTargetTheme(mode)} style={{ minHeight: '100dvh' }}>
      {React.Children.only(props.children)}
    </Grommet>
  )
}
export const ThemeProviderWithoutRedux = (props: { children: React.ReactNode }) => {
  const theme = deepMerge(grommet, grommetCustomTheme)
  const mode = getInitialThemeState().selected

  return (
    <Grommet theme={theme} themeMode={getTargetTheme(mode)} style={{ minHeight: '100dvh' }}>
      {React.Children.only(props.children)}
    </Grommet>
  )
}
