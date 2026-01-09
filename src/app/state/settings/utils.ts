import { UpdateGateCheckType, ScreenPrivacyType } from './slice/types'

export function saveScreenPrivacy(screenPrivacy: ScreenPrivacyType) {
  window.localStorage.setItem('screenPrivacy', screenPrivacy)
}

export function getScreenPrivacyFromStorage(): ScreenPrivacyType | null {
  return window.localStorage.getItem('screenPrivacy') as ScreenPrivacyType
}

export function saveUpdateGateCheck(updateGateCheck: UpdateGateCheckType) {
  window.localStorage.setItem('updateGateCheck', updateGateCheck)
}

export function getUpdateGateCheckFromStorage(): UpdateGateCheckType | null {
  return window.localStorage.getItem('updateGateCheck') as UpdateGateCheckType
}
