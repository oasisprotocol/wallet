import { useEffect } from 'react'
import { IonicProviderState } from '../providers/IonicContext'
import { updateAvailable } from '../utils/capacitor-app-update'

export const useIonicRequiresUpdate = (setState: (state: IonicProviderState) => void) => {
  useEffect(() => {
    let inProgress = true

    const init = async () => {
      const requiresUpdate = await updateAvailable()

      if (inProgress) {
        setState({ requiresUpdate })
      }
    }

    init()

    return () => {
      inProgress = false
    }
  }, [setState])
}
