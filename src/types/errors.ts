export class WalletError extends Error {
  constructor(
    public readonly type: WalletErrors,
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message)
  }
}

export enum WalletErrors {
  UnknownError = 'unknown',
  UnknownGrpcError = 'unknown_grpc',
  InvalidAddress = 'invalid_address',
  InvalidPrivateKey = 'invalid_private_key',
  InsufficientBalance = 'insufficient_balance',
  CannotSendToSelf = 'cannot_send_to_self',
  InvalidNonce = 'invalid_nonce',
  DuplicateTransaction = 'duplicate_transaction',
  NoOpenWallet = 'no_open_wallet',
  USBTransportError = 'usb_transport_error',
  USBTransportNotSupported = 'usb_transport_not_supported',
  BluetoothTransportNotSupported = 'bluetooth_transport_not_supported',
  LedgerUnknownError = 'unknown_ledger_error',
  LedgerCannotOpenOasisApp = 'cannot_open_oasis_app',
  LedgerOasisAppIsNotOpen = 'oasis_app_is_not_open',
  LedgerNoDeviceSelected = 'no_device_selected',
  LedgerTransactionRejected = 'transaction_rejected',
  LedgerAppVersionNotSupported = 'ledger_version_not_supported',
  LedgerDerivedDifferentAccount = 'ledger_derived_different_account',
  IndexerAPIError = 'indexer_api_error',
  DisconnectedError = 'disconnected_error',
  ParaTimesUnknownError = 'para_times_unknown_error',
}

export interface ErrorPayload {
  code: WalletErrors
  message: string
}

// Adds strict type-check that a type was exhausted
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
// https://stackoverflow.com/questions/41102060/typescript-extending-error-class
export class ExhaustedTypeError extends Error {
  constructor(
    messagePrefix: string,
    exhaustedType: 'Expected type to be exhausted, but this type was not handled',
  ) {
    super(
      `${messagePrefix}: Expected type to be exhausted, but this type was not handled: ${JSON.stringify(
        exhaustedType,
      )}`,
    )
  }
}

export class PasswordWrongError extends Error {
  constructor() {
    super('Password wrong')
  }
}
