// import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import * as oasis from '@oasisprotocol/client'
import { publicKeyToAddress, uint2hex } from 'app/lib/helpers'
import { Ledger, LedgerSigner } from 'app/lib/ledger'
import { OasisTransaction } from 'app/lib/transaction'
import { all, call, put, select, takeEvery } from 'typed-redux-saga'
import { ErrorPayload, WalletError, WalletErrors } from 'types/errors'

import { ledgerActions } from '.'
import { selectChainContext } from '../network/selectors'
import { getBalance } from '../wallet/saga'
import { LedgerAccount, LedgerStep } from './types'
import type Transport from '@ledgerhq/hw-transport'

function* setStep(step: LedgerStep) {
  yield* put(ledgerActions.setStep(step))
}

function* getUSBTransport() {
  const isSupported = yield* call([TransportWebUSB, TransportWebUSB.isSupported])
  if (!isSupported) {
    throw new WalletError(WalletErrors.USBTransportNotSupported, 'TransportWebUSB unsupported')
  }
  try {
    const transport = yield* call([TransportWebUSB, TransportWebUSB.create])
    return transport
  } catch (e: any) {
    if (e.message.match(/No device selected/)) {
      throw new WalletError(WalletErrors.LedgerNoDeviceSelected, e.message)
    } else {
      throw new WalletError(WalletErrors.USBTransportError, e.message)
    }
  }
}

function* enumerateAccounts() {
  yield* setStep(LedgerStep.OpeningUSB)
  let transport: Transport | undefined
  try {
    transport = yield* getUSBTransport()

    yield* setStep(LedgerStep.LoadingAccounts)
    const accounts = yield* call(Ledger.enumerateAccounts, transport)

    const balances = yield* all(accounts.map(a => call(getBalance, a.publicKey)))
    const addresses = yield* all(accounts.map(a => call(publicKeyToAddress, a.publicKey)))

    yield* setStep(LedgerStep.LoadingBalances)
    const wallets = accounts.map((a, index) => {
      return {
        publicKey: uint2hex(a.publicKey),
        path: a.path,
        address: addresses[index],
        balance: balances[index],
        // We select the first account by default
        selected: index === 0,
      } as LedgerAccount
    })

    yield* setStep(LedgerStep.Done)
    yield* put(ledgerActions.accountsListed(wallets))
  } catch (e: any) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(ledgerActions.operationFailed(payload))
  } finally {
    if (transport) {
      yield* call([transport, transport.close])
    }
  }
}

export function* sign<T>(signer: LedgerSigner, tw: oasis.consensus.TransactionWrapper<T>) {
  const transport = yield* getUSBTransport()
  const chainContext = yield* select(selectChainContext)

  signer.setTransport(transport)
  try {
    yield* call([OasisTransaction, OasisTransaction.signUsingLedger], chainContext, signer, tw)
  } catch (e) {
    throw e
  } finally {
    yield* call([transport, transport.close])
  }
}

export function* ledgerSaga() {
  yield* takeEvery(ledgerActions.enumerateAccounts, enumerateAccounts)
  // yield takeLatest(actions.someAction.type, doSomething);
}
