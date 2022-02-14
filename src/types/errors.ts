export class WalletError extends Error {
  constructor(public readonly type: WalletErrors, message: string, originalError?: Error) {
    super(message)
  }
}

export enum WalletErrors {
  UnknownError = 'unknown',
  InvalidAddress = 'invalid_address',
  InvalidPrivateKey = 'invalid_private_key',
  InsufficientBalance = 'insufficient_balance',
  CannotSendToSelf = 'cannot_send_to_self',
  InvalidNonce = 'invalid_nonce',
  DuplicateTransaction = 'duplicate_transaction',
  NoOpenWallet = 'no_open_wallet',
  USBTransportError = 'usb_transport_error',
  USBTransportNotSupported = 'usb_transport_not_supported',
  LedgerUnknownError = 'unknown_ledger_error',
  LedgerCannotOpenOasisApp = 'cannot_open_oasis_app',
  LedgerOasisAppIsNotOpen = 'oasis_app_is_not_open',
  LedgerNoDeviceSelected = 'no_device_selected',
  LedgerTransactionRejected = 'transaction_rejected',
  LedgerAppVersionNotSupported = 'ledger_version_not_supported',
}

export interface ErrorPayload {
  code: WalletErrors
  message: string
}
