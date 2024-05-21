import { createContext } from 'react'

export interface IonicProviderState {
  /**
   * Indicates whether an update is required.
   * In an undefined state, it indicates that the application is currently in loading phase.
   *
   * @type {boolean | undefined}
   */
  requiresUpdate: boolean | undefined
}

export interface IonicProviderContext {
  readonly state: IonicProviderState
}

export const IonicContext = createContext<IonicProviderContext>({} as IonicProviderContext)
