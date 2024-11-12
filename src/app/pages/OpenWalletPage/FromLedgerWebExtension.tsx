import React from 'react'
import { useHref } from 'react-router-dom'
import { openLedgerAccessPopup } from 'utils/webextension'
import { FromLedger } from './Features/FromLedger'

export function FromLedgerWebExtension() {
  const href = useHref('/open-wallet/connect-device')

  return (
    <FromLedger
      openLedgerAccessPopup={() => {
        openLedgerAccessPopup(href)
      }}
    />
  )
}
