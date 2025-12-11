import { PrivacyScreen } from '@capacitor/privacy-screen'
import { runtimeIs } from 'app/lib/runtimeIs'
import type { ScreenPrivacyType } from 'app/state/settings/slice/types'

export const setPrivacyScreen = async (state: ScreenPrivacyType): Promise<void> => {
  if (runtimeIs !== 'mobile-app') {
    return
  }

  if (state === 'on') {
    await PrivacyScreen.enable({
      android: {
        preventScreenshots: true,
        dimBackground: true,
        privacyModeOnActivityHidden: 'dim',
      },
      ios: { blurEffect: 'dark' },
    })
  } else {
    await PrivacyScreen.disable()
  }
}
