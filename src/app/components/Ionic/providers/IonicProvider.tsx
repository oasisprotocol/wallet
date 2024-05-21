import { FC, PropsWithChildren, useState } from 'react'
import { useIonicBackButtonListener } from '../hooks/useIonicBackButtonListener'
import { useIonicAppStateChangeListener } from '../hooks/useIonicAppStateChangeListener'
import { IonicContext, IonicProviderContext, IonicProviderState } from './IonicContext'
import { useIonicRequiresUpdate } from '../hooks/useIonicRequiresUpdate'

const ionicProviderInitialState: IonicProviderState = {
  requiresUpdate: undefined,
}

export const IonicContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<IonicProviderState>({ ...ionicProviderInitialState })

  useIonicRequiresUpdate(setState)
  useIonicAppStateChangeListener()
  useIonicBackButtonListener()

  const providerState: IonicProviderContext = {
    state,
  }

  return <IonicContext.Provider value={providerState}>{children}</IonicContext.Provider>
}
