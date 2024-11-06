import React from 'react'
import { openLedgerAccessPopup } from 'utils/webextension'
import { FromLedger } from './Features/FromLedger'

export function FromLedgerWebExtension() {
  return <FromLedger openLedgerAccessPopup={openLedgerAccessPopup} />
}
