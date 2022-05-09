import { ContextSigner } from '@oasisprotocol/client/dist/signature'
import OasisApp, { successOrThrow } from '@oasisprotocol/ledger'
import { Response } from '@oasisprotocol/ledger/dist/types'
import { Wallet, WalletType } from 'app/state/wallet/types'
import { WalletError, WalletErrors } from 'types/errors'
import { hex2uint } from './helpers'
import type Transport from '@ledgerhq/hw-transport'

interface LedgerAccount {
  publicKey: Uint8Array
  path: number[]
}

function successOrThrowWalletError<T>(response: Response<T>, message: string) {
  try {
    return successOrThrow(response)
  } catch (err) {
    const errResponse = err as Response<T>
    switch (errResponse.return_code) {
      case 0x6400:
        throw new WalletError(WalletErrors.LedgerAppVersionNotSupported, errResponse.error_message)
      case 0x6986:
        throw new WalletError(WalletErrors.LedgerTransactionRejected, errResponse.error_message)
      case 0x6804:
        throw new WalletError(WalletErrors.LedgerCannotOpenOasisApp, errResponse.error_message)

      default:
        throw new WalletError(WalletErrors.LedgerUnknownError, errResponse.error_message)
    }
  }
}

export class Ledger {
  public static async enumerateAccounts(transport: Transport, count = 5) {
    const accounts: LedgerAccount[] = []

    try {
      const app = new OasisApp(transport)
      const appInfo = successOrThrowWalletError(await app.appInfo(), 'ledger app info')
      if (appInfo.appName !== 'Oasis') {
        throw new WalletError(WalletErrors.LedgerOasisAppIsNotOpen, 'Oasis App is not open')
      }
      for (let i = 0; i < count; i++) {
        const path = [44, 474, 0, 0, i]
        const publicKeyResponse = successOrThrowWalletError(await app.publicKey(path), 'ledger public key')
        accounts.push({ path, publicKey: new Uint8Array(publicKeyResponse.pk) })
      }
    } catch (e) {
      throw e
    }

    return accounts
  }
}

export class LedgerSigner implements ContextSigner {
  // Oasis ledger app. Some typings would be great...!
  protected transport?: Transport
  protected path: number[]
  protected publicKey: Uint8Array

  constructor(wallet: Wallet) {
    if (!wallet.path || wallet.type !== WalletType.Ledger) {
      throw new Error('Given wallet is not a ledger wallet')
    }
    this.path = wallet.path
    this.publicKey = hex2uint(wallet.publicKey)
  }

  public setTransport(transport: Transport) {
    this.transport = transport
  }

  public public(): Uint8Array {
    return this.publicKey
  }

  public async sign(context: string, message: Uint8Array): Promise<Uint8Array> {
    if (!this.transport) {
      throw new Error('Cannot sign using ledger without an active WebUSB transport')
    }

    const app = new OasisApp(this.transport)
    const response = successOrThrowWalletError(
      await app.sign(this.path, context, Buffer.from(message)),
      'ledger sign',
    )
    return new Uint8Array(response.signature!)
  }
}
