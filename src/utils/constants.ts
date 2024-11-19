export const MessageTypes = {
  USB_LEDGER_PERMISSION_GRANTED: 'usb-ledger-permission-granted',
} as const

export type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes]
