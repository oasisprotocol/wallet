import { FC, PropsWithChildren } from 'react'
import { useIonicBackButtonListener } from '../hooks/useIonicBackButtonListener'
import { useIonicAppStateChangeListener } from '../hooks/useIonicAppStateChangeListener'
import { IonicContext, IonicProviderContext } from './IonicContext'
import { useIonicRequiresUpdate } from '../hooks/useIonicRequiresUpdate'

export const IonicContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { requiresUpdateState, checkForUpdateAvailability, skipUpdate } = useIonicRequiresUpdate()
  useIonicAppStateChangeListener()
  useIonicBackButtonListener()

  const providerState: IonicProviderContext = {
    requiresUpdateState,
    checkForUpdateAvailability,
    skipUpdate,
  }

  return <IonicContext.Provider value={providerState}>{children}</IonicContext.Provider>
}
