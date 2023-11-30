import { ContextSigner } from '@oasisprotocol/client/dist/signature'
import OasisApp, { successOrThrow } from '@oasisprotocol/ledger'
import { Response } from '@oasisprotocol/ledger/dist/types'
import { LedgerWalletType, Wallet, WalletType } from 'app/state/wallet/types'
import { WalletError, WalletErrors } from 'types/errors'
import { hex2uint, publicKeyToAddress } from './helpers'
import type Transport from '@ledgerhq/hw-transport'
import { isSupported, requestLedgerDevice } from '@ledgerhq/hw-transport-webusb/lib-es/webusb'
import BleTransport from '@oasisprotocol/ionic-ledger-hw-transport-ble/lib'
import { Capacitor } from '@capacitor/core'

interface LedgerAccount {
  publicKey: Uint8Array
  path: number[]
  pathDisplay: string
}

export async function canAccessNavigatorUsb(): Promise<boolean> {
  return await isSupported()
}

export async function canAccessBle(): Promise<boolean> {
  const hasBLE = await BleTransport.isEnabled().catch(() => false)
  // Scan depends on requestLEScan method, which is not available on the web(feature flag)
  const hasLEScan = Capacitor.isNativePlatform() || !!navigator?.bluetooth?.requestLEScan
  return hasBLE && hasLEScan
}

export async function requestDevice(): Promise<USBDevice | undefined> {
  if (await isSupported()) {
    return await requestLedgerDevice()
  }
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
  public static async getOasisApp(transport: Transport): Promise<OasisApp> {
    const app = new OasisApp(transport)
    const appInfo = successOrThrowWalletError(await app.appInfo(), 'ledger app info')
    if (appInfo.appName !== 'Oasis') {
      throw new WalletError(WalletErrors.LedgerOasisAppIsNotOpen, 'Oasis App is not open')
    }
    return app
  }

  public static async deriveAccountUsingOasisApp(
    app: OasisApp,
    addressIndex: number,
  ): Promise<LedgerAccount> {
    const path = [44, 474, 0, 0, addressIndex]
    const pathDisplay = `m/44'/474'/0'/0'/${addressIndex}'` // Hardening should match app.publicKey implementation
    const publicKeyResponse = successOrThrowWalletError(await app.publicKey(path), 'ledger public key')
    return {
      path,
      pathDisplay,
      publicKey: new Uint8Array(publicKeyResponse.pk),
    }
  }

  public static async enumerateAccounts(transport: Transport, count = 5, start = 0) {
    const app = await Ledger.getOasisApp(transport)
    const accounts: LedgerAccount[] = []
    for (let i = start; i < start + count; i++) {
      accounts.push(await Ledger.deriveAccountUsingOasisApp(app, i))
    }
    return accounts
  }

  public static async validateAccountDerivation(
    app: OasisApp,
    path: number[],
    expectedPublicKey: Uint8Array,
  ) {
    const expectedAddress = await publicKeyToAddress(expectedPublicKey)

    const publicKeyResponse = successOrThrowWalletError(await app.publicKey(path), 'ledger public key')
    const publicKey = new Uint8Array(publicKeyResponse.pk)
    const reDerivedAddress = await publicKeyToAddress(publicKey)
    if (expectedAddress !== reDerivedAddress) {
      throw new WalletError(
        WalletErrors.LedgerDerivedDifferentAccount,
        `expected to derive ${expectedAddress} but ledger derived ${reDerivedAddress}`,
      )
    }
  }
}

export class LedgerSigner implements ContextSigner {
  // Oasis ledger app. Some typings would be great...!
  protected transport?: Transport
  protected path: number[]
  protected publicKey: Uint8Array
  transportType: LedgerWalletType

  constructor(wallet: Wallet) {
    if (!wallet.path || (wallet.type !== WalletType.UsbLedger && wallet.type !== WalletType.BleLedger)) {
      throw new Error('Given wallet is not a ledger wallet')
    }
    this.path = wallet.path
    this.publicKey = hex2uint(wallet.publicKey)
    this.transportType = wallet.type
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
    await Ledger.validateAccountDerivation(app, this.path, this.publicKey)
    const response = successOrThrowWalletError(
      await app.sign(this.path, context, Buffer.from(message)),
      'ledger sign',
    )
    return new Uint8Array(response.signature!)
  }
}
