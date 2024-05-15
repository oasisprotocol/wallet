import { useEffect, useRef } from 'react'
import { App } from '@capacitor/app'
import { deltaMsToLockProfile } from '../../../../ionicConfig'
import { persistActions } from '../../../state/persist'
import { useDispatch } from 'react-redux'

export const useIonicAppStateChangeListener = () => {
  const dispatch = useDispatch()
  const lockTimestamp = useRef<number>()

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
      appStateChangeListenerHandle.then(pluginListenerHandle => pluginListenerHandle.remove())
    }
  }, [dispatch])
}
