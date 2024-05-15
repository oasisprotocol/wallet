import { createContext, FC, PropsWithChildren } from 'react'
import { Capacitor } from '@capacitor/core'
import { useIonicBackButtonListener } from './hooks/useIonicBackButtonListener'
import { useIonicAppStateChangeListener } from './hooks/useIonicAppStateChangeListener'

const IonicContext = createContext<undefined>(undefined)

const IonicContextProvider: FC<PropsWithChildren> = ({ children }) => {
  useIonicBackButtonListener()
  useIonicAppStateChangeListener()

  return <IonicContext.Provider value={undefined}>{children}</IonicContext.Provider>
}

export const IonicProvider: FC<PropsWithChildren> = ({ children }) => {
  if (Capacitor.isNativePlatform()) {
    return <IonicContextProvider>{children}</IonicContextProvider>
  }

  return children
}
