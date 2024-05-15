import { createContext, FC, PropsWithChildren, useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { useDispatch } from 'react-redux'
import { persistActions } from '../../state/persist'
import { deltaMsToLockProfile } from '../../../ionicConfig'
import { useIonicBackButtonListener } from './hooks/useIonicBackButtonListener'

const IonicContext = createContext<undefined>(undefined)

const IonicContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch()
  const lockTimestamp = useRef<number>()

  useIonicBackButtonListener()

  useEffect(() => {
    const appStateChangeListenerHandle = App.addListener('appStateChange', ({ isActive }) => {
      const shouldLock = lockTimestamp.current && Date.now() - lockTimestamp.current > deltaMsToLockProfile
      if (isActive && shouldLock) {
        dispatch(persistActions.lockAsync())
      } else if (isActive && !shouldLock) {
        lockTimestamp.current = undefined
      }

      if (!isActive) {
        lockTimestamp.current = Date.now()
      }
    })

    return () => {
      appStateChangeListenerHandle.remove()
    }
  }, [dispatch])

  return <IonicContext.Provider value={undefined}>{children}</IonicContext.Provider>
}

export const IonicProvider: FC<PropsWithChildren> = ({ children }) => {
  if (Capacitor.isNativePlatform()) {
    return <IonicContextProvider>{children}</IonicContextProvider>
  }

  return children
}
