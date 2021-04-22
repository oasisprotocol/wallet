// import { take, call, put, select, takeLatest } from 'redux-saga/effects';

import * as oasis from '@oasisprotocol/client'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { publicKeyToAddress, uint2hex } from 'app/lib/helpers'
import { Ledger, LedgerSigner } from 'app/lib/ledger'
import { OasisTransaction } from 'app/lib/transaction'
import { all, call, put, takeEvery } from 'typed-redux-saga'
import { ErrorPayload, WalletError, WalletErrors } from 'types/errors'
import { ledgerActions } from '.'
import { getBalance } from '../wallet/saga'
import { LedgerAccount, LedgerStep } from './types'

function* setStep(step: LedgerStep) {
  yield* put(ledgerActions.setStep(step))
}

function* enumerateAccounts() {
  yield* setStep(LedgerStep.OpeningUSB)

  let transport: any
  try {
    transport = yield* call([TransportWebUSB, TransportWebUSB.create])

    yield* setStep(LedgerStep.LoadingAccounts)
    const accounts = yield* call(Ledger.enumerateAccounts, transport)

    const balances = yield* all(accounts.map(a => call(getBalance, a.publicKey)))
    const addresses = yield* all(accounts.map(a => call(publicKeyToAddress, a.publicKey)))

    yield* setStep(LedgerStep.LoaddingBalances)
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
  } catch (e) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(ledgerActions.operationFailed(payload))
  }

  if (transport) {
    yield* call([transport, transport.close])
  }
}

export function* sign<T>(signer: LedgerSigner, tw: oasis.consensus.TransactionWrapper<T>) {
  let transport: any
  try {
    transport = yield* call([TransportWebUSB, TransportWebUSB.create])
  } catch (e) {
    throw new WalletError(WalletErrors.USBTransportError, e.message)
  }

  signer.setTransport(transport)
  try {
    yield* call([OasisTransaction, OasisTransaction.signUsingLedger], signer, tw)
  } catch (e) {
    throw new WalletError(WalletErrors.UnknownError, e.message)
  }

  yield* call([transport, transport.close])
}

export function* ledgerSaga() {
  yield* takeEvery(ledgerActions.enumerateAccounts, enumerateAccounts)
  // yield takeLatest(actions.someAction.type, doSomething);
}
