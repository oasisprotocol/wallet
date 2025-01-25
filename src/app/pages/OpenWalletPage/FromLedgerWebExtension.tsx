import React from 'react'
import { openLedgerAccessPopup } from 'utils/webextension'
import { FromLedger } from './Features/FromLedger'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExtLedgerAccessPopup } from '../../../../extension/src/ExtLedgerAccessPopup/ExtLedgerAccessPopup'

export function FromLedgerWebExtension() {
  /** See {@link ExtLedgerAccessPopup} */
  const href = new URL('../../../../extension/src/ExtLedgerAccessPopup/index.html', import.meta.url).href

  return (
    <FromLedger
      openLedgerAccessPopup={() => {
        openLedgerAccessPopup(href)
      }}
    />
  )
}
