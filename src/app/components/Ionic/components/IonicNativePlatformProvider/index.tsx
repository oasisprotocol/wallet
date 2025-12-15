import { FC, PropsWithChildren, useEffect } from 'react'
import { runtimeIs } from 'app/lib/runtimeIs'
import { IonicContextProvider } from '../../providers/IonicProvider'
import { UpdateGate } from '../UpdateGate'
import { setPrivacyScreen } from 'app/lib/privacyScreen'
import { selectScreenPrivacy } from 'app/state/settings/slice/selectors'
import { useSelector } from 'react-redux'
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support'
import { StatusBar, Style } from '@capacitor/status-bar'
import { selectTheme } from 'styles/theme/slice/selectors'
import { getTargetTheme } from 'styles/theme/utils'

export const IonicNativePlatformProvider: FC<PropsWithChildren> = ({ children }) => {
  const screenPrivacy = useSelector(selectScreenPrivacy)
  const theme = useSelector(selectTheme)
  const targetTheme = getTargetTheme(theme)

  useEffect(() => {
    setPrivacyScreen(screenPrivacy).catch(error => {
      console.error('Failed to initialize PrivacyScreen on app startup:', error)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (runtimeIs !== 'mobile-app') {
      return
    }

    const setEdgeToEdgeBackground = async () => {
      if (targetTheme === 'dark') {
        await EdgeToEdge.setBackgroundColor({ color: '#1a1a2e' })
        await StatusBar.setStyle({ style: Style.Dark })
      } else {
        await EdgeToEdge.setBackgroundColor({ color: '#efefef' })
        await StatusBar.setStyle({ style: Style.Light })
      }
    }

    setEdgeToEdgeBackground()
  }, [targetTheme])

  if (runtimeIs === 'mobile-app') {
    return (
      <IonicContextProvider>
        <UpdateGate>{children}</UpdateGate>
      </IonicContextProvider>
    )
  }

  return children
}
