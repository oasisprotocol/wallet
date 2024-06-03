import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update'
import { Capacitor } from '@capacitor/core'

export const updateAvailable = async () => {
  const result = await AppUpdate.getAppUpdateInfo()
  const { updateAvailability, currentVersionCode, availableVersionCode } = result

  switch (updateAvailability) {
    case AppUpdateAvailability.UPDATE_IN_PROGRESS:
      return undefined
    case AppUpdateAvailability.UPDATE_NOT_AVAILABLE:
      return false
    // Returns UNKNOWN when unable to determine with mobile app store if update is available or not
    case AppUpdateAvailability.UNKNOWN:
      return true
  }

  if (Capacitor.getPlatform() === 'android') {
    // Example of version code -> "1", "2", ...
    return (
      parseInt(availableVersionCode ?? `${Number.MAX_SAFE_INTEGER}`, 10) >
      parseInt(currentVersionCode ?? '0', 10)
    )
  }

  // TODO: Add for iOS
  // Compare semVer between currentVersionName and availableVersionName
  throw new Error('Unknown Capacitor platform!')
}

export const navigateToAppStore = async () => {
  await AppUpdate.openAppStore()
}
