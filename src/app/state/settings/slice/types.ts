export type ScreenPrivacyType = 'on' | 'off'
export type UpdateGateCheckType = 'on' | 'off'

export interface SettingsState {
  screenPrivacy: ScreenPrivacyType
  updateGateCheck: UpdateGateCheckType
}
