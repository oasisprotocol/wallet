import { ThemeKeyType } from './slice/types'

/* istanbul ignore next line */
export const isSystemDark = window?.matchMedia
  ? window.matchMedia('(prefers-color-scheme: dark)')?.matches
  : undefined

export function saveTheme(theme: ThemeKeyType) {
  window.localStorage.setItem('selectedTheme', theme)
}

/* istanbul ignore next line */
export function getThemeFromStorage(): ThemeKeyType | null {
  return window.localStorage.getItem('selectedTheme') as ThemeKeyType
}
