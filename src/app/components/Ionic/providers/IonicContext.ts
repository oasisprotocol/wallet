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

export interface IonicProviderState {
  updateAvailability: UpdateAvailability
  error: Error | null
}

export interface IonicProviderContext {
  readonly state: IonicProviderState
  checkForUpdateAvailability: () => void
  skipUpdate: () => void
}

export const IonicContext = createContext<IonicProviderContext>({} as IonicProviderContext)
