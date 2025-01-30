import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { selectAddress } from 'app/state/wallet/selectors'

export const useRouteRedirects = () => {
  const address = useSelector(selectAddress)
  const navigate = useNavigate()

  useEffect(() => {
    const hasRecentlyGrantedUsbAccess =
      Date.now() - parseInt(window.localStorage.getItem('oasis_wallet_granted_usb_ledger_timestamp') ?? '0') <
      5 * 60 * 1000

    if (hasRecentlyGrantedUsbAccess) {
      // When we implement auto-locking, this won't correctly redirect if wallet
      // gets locked within 5min (useEffect called with address=undefined before unlocking).
      navigate(`/open-wallet/ledger`)
      // Delay is needed as workaround for React.StrictMode.
      setTimeout(() => window.localStorage.removeItem('oasis_wallet_granted_usb_ledger_timestamp'), 1000)
    } else if (address) {
      navigate(`/account/${address}`)
    }
  }, [address, navigate])
}
