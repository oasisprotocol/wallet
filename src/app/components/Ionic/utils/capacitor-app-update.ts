import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update'
import { Capacitor } from '@capacitor/core'

export const updateAvailable = async () => {
  const result = await AppUpdate.getAppUpdateInfo()
  const { updateAvailability, currentVersionCode, availableVersionCode } = result

  if (updateAvailability === AppUpdateAvailability.UPDATE_IN_PROGRESS) {
    return undefined
  }

  // TODO: Skips in case there is no internet connection
  if (updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
    return false
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
