import { useEffect, useState } from 'react'
import { IonicRequiresUpdateState, UpdateAvailability } from '../providers/IonicContext'
import { updateAvailable } from '../utils/capacitor-app-update'

const ionicRequiresUpdateInitialState: IonicRequiresUpdateState = {
  updateAvailability: UpdateAvailability.NOT_INITIALIZED,
  error: null,
}

export const useIonicRequiresUpdate = () => {
  const [state, setState] = useState<IonicRequiresUpdateState>({ ...ionicRequiresUpdateInitialState })

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

  const skipUpdate = () => {
    setState(prevState => ({ ...prevState, updateAvailability: UpdateAvailability.UPDATE_NOT_AVAILABLE }))
  }

  return { requiresUpdateState: state, checkForUpdateAvailability, skipUpdate }
}
