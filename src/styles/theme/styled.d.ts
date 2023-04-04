import 'styled-components'
import { ThemeType } from 'grommet'

/* This is the suggested way of declaring theme types */
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
