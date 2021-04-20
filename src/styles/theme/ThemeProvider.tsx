import { Grommet, ThemeType } from 'grommet'
import * as React from 'react'

import { useThemeSlice } from './slice'

const defaultGrommetTheme: ThemeType = {
  global: {
    font: {
      family: 'Rubik',
    },
  },
}
export const ThemeProvider = (props: { children: React.ReactChild }) => {
  useThemeSlice()

  // const theme = useSelector(selectTheme);
  return (
    // <OriginalThemeProvider theme={theme}>
    <Grommet full theme={defaultGrommetTheme}>
      {React.Children.only(props.children)}
    </Grommet>
    // </OriginalThemeProvider>
  )
}
