import { createContext } from 'react'

export enum UpdateAvailability {
  NOT_INITIALIZED,
  LOADING,
  UPDATE_AVAILABLE,
  UPDATE_NOT_AVAILABLE,
  UPDATE_IN_PROGRESS,
  ERROR,
  UNKNOWN,
}

export interface IonicRequiresUpdateState {
  updateAvailability: UpdateAvailability
  error: Error | null
}

export interface IonicProviderContext {
  readonly requiresUpdateState: IonicRequiresUpdateState
  checkForUpdateAvailability: () => void
  skipUpdate: () => void
}

export const IonicContext = createContext<IonicProviderContext>({} as IonicProviderContext)
