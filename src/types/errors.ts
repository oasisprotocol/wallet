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
}

export interface ErrorPayload {
  code: WalletErrors
  message: string
}
