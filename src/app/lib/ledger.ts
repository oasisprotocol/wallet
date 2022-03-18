import { ContextSigner } from '@oasisprotocol/client/dist/signature'
import OasisApp from '@oasisprotocol/ledger'
import { Wallet, WalletType } from 'app/state/wallet/types'
import { WalletError, WalletErrors } from 'types/errors'
import { hex2uint } from './helpers'
import type Transport from '@ledgerhq/hw-transport'

export const DerivationPathTypeAdr8 = 'adr8'
export const DerivationPathTypeLegacy = 'legacy'

interface Response {
  return_code: number
  error_message: string
  [index: string]: unknown
}

interface LedgerAccount {
  publicKey: Uint8Array
  path: number[]
}

const successOrThrow = (response: Response, message: string) => {
  if (response.return_code !== 0x9000) {
    switch (response.return_code) {
      case 0x6400:
        throw new WalletError(WalletErrors.LedgerAppVersionNotSupported, response.error_message)
      case 0x6986:
        throw new WalletError(WalletErrors.LedgerTransactionRejected, response.error_message)
      case 0x6804:
        throw new WalletError(WalletErrors.LedgerCannotOpenOasisApp, response.error_message)

      default:
        throw new WalletError(WalletErrors.LedgerUnknownError, response.error_message)
    }
  }
  return response
}

export class Ledger {
  public static mustGetPath(pathType: string, i: number) {
    switch (pathType) {
      case DerivationPathTypeAdr8:
        return [44, 474, i]
      case DerivationPathTypeLegacy:
        return [44, 474, 0, 0, i]
    }

    throw new TypeError('invalid pathType: ' + pathType)
  }

  public static async enumerateAccounts(transport: Transport, pathType: string, count = 5) {
    const accounts: LedgerAccount[] = []

    try {
      const app = new OasisApp(transport)
      const appInfo = successOrThrow(await app.appInfo(), 'ledger app info')
      if (appInfo.appName !== 'Oasis') {
        throw new WalletError(WalletErrors.LedgerOasisAppIsNotOpen, 'Oasis App is not open')
      }
      for (let i = 0; i < count; i++) {
        const path = Ledger.mustGetPath(pathType, i)
        const publicKeyResponse = successOrThrow(await app.publicKey(path), 'ledger public key')
        accounts.push({ path, publicKey: new Uint8Array(publicKeyResponse.pk as Buffer) })
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
    const response = successOrThrow(await app.sign(this.path, context, Buffer.from(message)), 'ledger sign')
    return new Uint8Array(response.signature as Buffer)
  }
}
