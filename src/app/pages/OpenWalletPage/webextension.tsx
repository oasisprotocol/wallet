import React from 'react'
import { useHref } from 'react-router-dom'
import { openLedgerAccessPopup } from 'utils/webextension'
import { SelectOpenMethod } from './'

export function OpenWalletPageWebExtension() {
  const href = useHref('connect-device')

  return <SelectOpenMethod webExtensionLedgerAccess={() => openLedgerAccessPopup(href)} />
}
