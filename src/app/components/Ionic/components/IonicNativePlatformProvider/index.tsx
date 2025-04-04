import { FC, PropsWithChildren } from 'react'
import { runtimeIs } from 'app/lib/runtimeIs'
import { IonicContextProvider } from '../../providers/IonicProvider'
import { UpdateGate } from '../UpdateGate'

export const IonicNativePlatformProvider: FC<PropsWithChildren> = ({ children }) => {
  if (runtimeIs === 'mobile-app') {
    return (
      <IonicContextProvider>
        <UpdateGate>{children}</UpdateGate>
      </IonicContextProvider>
    )
  }

  return children
}
