import React from 'react'
import { openLedgerAccessPopup } from 'utils/webextension'
import { FromLedger } from './Features/FromLedger'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExtensionRequestLedgerPermissionPopup } from '../../../../extension/src/ExtensionRequestLedgerPermissionPopup/ExtensionRequestLedgerPermissionPopup'

export function FromLedgerWebExtension() {
  /** See {@link ExtensionRequestLedgerPermissionPopup} */
  const href = new URL(
    '../../../../extension/src/ExtensionRequestLedgerPermissionPopup/index.html',
    import.meta.url,
  ).href

  return (
    <FromLedger
      webExtensionUSBLedgerAccess={() => {
        openLedgerAccessPopup(href)
      }}
    />
  )
}
