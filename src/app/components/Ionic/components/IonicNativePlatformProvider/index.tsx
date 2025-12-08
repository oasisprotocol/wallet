import { FC, PropsWithChildren, useEffect } from 'react'
import { runtimeIs } from 'app/lib/runtimeIs'
import { IonicContextProvider } from '../../providers/IonicProvider'
import { UpdateGate } from '../UpdateGate'
import { setPrivacyScreen } from 'app/lib/privacyScreen'
import { selectScreenPrivacy } from 'app/state/settings/slice/selectors'
import { useSelector } from 'react-redux'

export const IonicNativePlatformProvider: FC<PropsWithChildren> = ({ children }) => {
  const screenPrivacy = useSelector(selectScreenPrivacy)

  useEffect(() => {
    setPrivacyScreen(screenPrivacy).catch(error => {
      console.error('Failed to initialize PrivacyScreen on app startup:', error)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (runtimeIs === 'mobile-app') {
    return (
      <IonicContextProvider>
        <UpdateGate>{children}</UpdateGate>
      </IonicContextProvider>
    )
  }

  return children
}
