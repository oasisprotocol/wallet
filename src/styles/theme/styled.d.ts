import 'styled-components'
import type { ThemeType } from 'grommet/es6/themes'

/* This is the suggested way of declaring theme types */
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
