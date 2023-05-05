import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { selectAddress } from 'app/state/wallet/selectors'

export const useRouteRedirects = () => {
  const address = useSelector(selectAddress)
  const navigate = useNavigate()

  useEffect(() => {
    if (address) {
      navigate(`/account/${address}`)
    }
  }, [address, navigate])
}
