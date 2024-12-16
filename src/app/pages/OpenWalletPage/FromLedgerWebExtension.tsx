import { useEffect, useState } from 'react'
import { useHref } from 'react-router-dom'
import { openLedgerAccessPopup } from 'utils/webextension'
import { FromLedger } from './Features/FromLedger'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { MessageTypes, MessageType } from '../../../utils/constants'

const chrome = (window as any).chrome

export function FromLedgerWebExtension() {
  const href = useHref('/open-wallet/connect-device')
  const [hasUsbLedgerAccess, setHasUsbLedgerAccess] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const checkUsbLedgerAccess = async () => {
      try {
        // In default ext popup this gets auto-accepted / auto-rejected. In a tab or persistent popup it would
        // prompt user to select a ledger device. TransportWebUSB.create seems to match requestDevice called in
        // openLedgerAccessPopup.
        // If TransportWebUSB.create() is rejected then call openLedgerAccessPopup and requestDevice. When user
        // confirms the prompt tell them to come back here. TransportWebUSB.create() will resolve.
        await TransportWebUSB.create()
        setHasUsbLedgerAccess(true)
      } catch (error) {
        setHasUsbLedgerAccess(false)
      }
    }
    checkUsbLedgerAccess()

    const handleMessage = (message: { type: MessageType }) => {
      if (message.type === MessageTypes.USB_LEDGER_PERMISSION_GRANTED) {
        setHasUsbLedgerAccess(true)
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  return (
    <FromLedger
      openLedgerAccessPopup={
        hasUsbLedgerAccess === false
          ? () => {
              openLedgerAccessPopup(href)
            }
          : undefined
      }
    />
  )
}
