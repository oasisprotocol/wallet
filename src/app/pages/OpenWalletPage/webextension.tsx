import React from 'react'
import { openLedgerAccessPopup } from 'utils/webextension'
import { FromLedger } from './Features/FromLedger'

export function FromLedgerWebExtension() {
  const href = new URL('../ExtensionRequestLedgerPermissionPopup/index.html', import.meta.url).href

  return (
    <FromLedger
      webExtensionUSBLedgerAccess={() => {
        openLedgerAccessPopup(href)
      }}
    />
  )
}
