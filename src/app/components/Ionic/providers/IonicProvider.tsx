import { FC, PropsWithChildren, useState } from 'react'
import { useIonicBackButtonListener } from '../hooks/useIonicBackButtonListener'
import { useIonicAppStateChangeListener } from '../hooks/useIonicAppStateChangeListener'
import { IonicContext, IonicProviderContext, IonicProviderState, UpdateAvailability } from './IonicContext'
import { useIonicRequiresUpdate } from '../hooks/useIonicRequiresUpdate'

const ionicProviderInitialState: IonicProviderState = {
  updateAvailability: UpdateAvailability.NOT_INITIALIZED,
  error: null,
}

export const IonicContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<IonicProviderState>({ ...ionicProviderInitialState })

  const { checkForUpdateAvailability } = useIonicRequiresUpdate(state, setState)
  useIonicAppStateChangeListener()
  useIonicBackButtonListener()

  const providerState: IonicProviderContext = {
    state,
    checkForUpdateAvailability,
  }

  return <IonicContext.Provider value={providerState}>{children}</IonicContext.Provider>
}
