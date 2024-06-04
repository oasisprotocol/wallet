import { Dispatch, SetStateAction, useEffect } from 'react'
import { IonicProviderState, UpdateAvailability } from '../providers/IonicContext'
import { updateAvailable } from '../utils/capacitor-app-update'

export const useIonicRequiresUpdate = (
  state: IonicProviderState,
  setState: Dispatch<SetStateAction<IonicProviderState>>,
) => {
  const checkForUpdateAvailability = async () => {
    if (state.updateAvailability === UpdateAvailability.LOADING) {
      return
    }

    setState(prevState => ({ ...prevState, updateAvailability: UpdateAvailability.LOADING }))

    try {
      const updateAvailability = await updateAvailable()

      setState(prevState => ({ ...prevState, updateAvailability }))
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        updateAvailability: UpdateAvailability.ERROR,
        error: error as Error,
      }))
    }
  }

  useEffect(() => {
    checkForUpdateAvailability()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { checkForUpdateAvailability }
}
