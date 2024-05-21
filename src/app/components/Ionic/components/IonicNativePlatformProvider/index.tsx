import { FC, PropsWithChildren } from 'react'
import { Capacitor } from '@capacitor/core'
import { IonicContextProvider } from '../../providers/IonicProvider'
import { UpdateGate } from '../UpdateGate'

export const IonicNativePlatformProvider: FC<PropsWithChildren> = ({ children }) => {
  if (Capacitor.isNativePlatform()) {
    return (
      <IonicContextProvider>
        <UpdateGate>{children}</UpdateGate>
      </IonicContextProvider>
    )
  }

  return children
}
