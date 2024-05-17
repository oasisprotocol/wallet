import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { useNavigate } from 'react-router-dom'

export const useIonicBackButtonListener = () => {
  const navigate = useNavigate()

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

    return () => {
      backButtonListenerHandle.then(pluginListenerHandle => pluginListenerHandle.remove())
    }
  }, [navigate])
}
