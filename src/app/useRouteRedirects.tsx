import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { selectActiveWalletId, selectAddress } from 'app/state/wallet/selectors'

export const useRouteRedirects = () => {
  const activeWalletIndex = useSelector(selectActiveWalletId)
  const address = useSelector(selectAddress)
  const history = useHistory()

  useEffect(() => {
    if (typeof activeWalletIndex !== 'undefined' && address) {
      history.push(`/account/${address}`)
    }
  }, [activeWalletIndex, address, history])
}
