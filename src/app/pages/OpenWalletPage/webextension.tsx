import React from 'react'
import { useHref, useNavigate } from 'react-router-dom'
import { openLedgerAccessPopup } from 'utils/webextension'
import { FromLedger } from './Features/FromLedger'

export function FromLedgerWebExtension() {
  const href = useHref('/extension-request-ledger-permission-popup')
  const navigate = useNavigate()

  return (
    <FromLedger
      webExtensionUSBLedgerAccess={() => {
        navigate('/open-wallet/ledger/usb')
        openLedgerAccessPopup(href)
        // check if ledger popup works
      }}
    />
  )
}
