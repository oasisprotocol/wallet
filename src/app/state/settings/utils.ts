import { ScreenPrivacyType } from './slice/types'

export function saveScreenPrivacy(screenPrivacy: ScreenPrivacyType) {
  window.localStorage.setItem('screenPrivacy', screenPrivacy)
}

export function getScreenPrivacyFromStorage(): ScreenPrivacyType | null {
  return window.localStorage.getItem('screenPrivacy') as ScreenPrivacyType
}
