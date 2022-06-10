import 'styled-components'
import { ThemeType } from 'grommet'

/* This is the suggested way of declaring theme types */
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeType {}
}
