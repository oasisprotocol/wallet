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
    // omit navigate dependency as it is not stable
    // https://github.com/remix-run/react-router/issues/7634
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])
}
