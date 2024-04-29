import React from 'react'
import { useHref, useNavigate } from 'react-router-dom'
import { openLedgerAccessPopup } from 'utils/webextension'
import { FromLedger } from './Features/FromLedger'

export function FromLedgerWebExtension() {
  const href = useHref('/open-wallet/connect-device')
  const navigate = useNavigate()

  return (
    <FromLedger
      webExtensionUSBLedgerAccess={() => {
        navigate('/open-wallet/ledger/usb')
        openLedgerAccessPopup(href)
      }}
    />
  )
}
