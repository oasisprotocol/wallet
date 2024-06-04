import {
  AppUpdate,
  AppUpdateAvailability as IonicAppUpdateAvailability,
} from '@capawesome/capacitor-app-update'
import { Capacitor } from '@capacitor/core'
import { UpdateAvailability } from '../providers/IonicContext'

// TODO: Skip on local builds
export const updateAvailable = async (): Promise<UpdateAvailability> => {
  const result = await AppUpdate.getAppUpdateInfo()
  const { updateAvailability, currentVersionCode, availableVersionCode } = result

  switch (updateAvailability) {
    case IonicAppUpdateAvailability.UPDATE_IN_PROGRESS:
      return UpdateAvailability.UPDATE_IN_PROGRESS
    case IonicAppUpdateAvailability.UPDATE_NOT_AVAILABLE:
      return UpdateAvailability.UPDATE_NOT_AVAILABLE
    // Returns UNKNOWN when unable to determine with mobile app store if update is available or not
    case IonicAppUpdateAvailability.UNKNOWN:
      return UpdateAvailability.UNKNOWN
  }

  // Example of version code -> "1", "2", ...
  if (
    Capacitor.getPlatform() === 'android' &&
    parseInt(availableVersionCode ?? `${Number.MAX_SAFE_INTEGER}`, 10) >
      parseInt(currentVersionCode ?? '0', 10)
  ) {
    return UpdateAvailability.UPDATE_AVAILABLE
  }

  // TODO: Add for iOS
  // Compare semVer between currentVersionName and availableVersionName
  throw new Error('Unknown Capacitor platform!')
}

export const navigateToAppStore = async () => {
  await AppUpdate.openAppStore()
}
