import { createContext, FC, PropsWithChildren, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { useDispatch } from 'react-redux'
import { persistActions } from '../../state/persist'
import { deltaMsToLockProfile } from '../../../ionicConfig'

const IonicContext = createContext<undefined>(undefined)

const IonicContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const lockTimestamp = useRef<number>()

  useEffect(() => {
    /**
     * The back button refers to the physical back button on an Android device and should not be confused
     * with either the browser back button or ion-back-button.
     */
    const backButtonListenerHandle = App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp()
      } else {
        navigate(-1)
      }
    })

    // TODO: appStateChange triggers on the web platform as well, using visibilitychange listener, consider reusing the code(downside @capacitor/app dependency on web & extension)
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
      backButtonListenerHandle.remove()
      appStateChangeListenerHandle.remove()
    }
  }, [dispatch, navigate])

  return <IonicContext.Provider value={undefined}>{children}</IonicContext.Provider>
}

export const IonicProvider: FC<PropsWithChildren> = ({ children }) => {
  if (Capacitor.isNativePlatform()) {
    return <IonicContextProvider>{children}</IonicContextProvider>
  }

  return children
}
