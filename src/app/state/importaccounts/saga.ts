import { PayloadAction } from '@reduxjs/toolkit'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import * as oasis from '@oasisprotocol/client'
import { publicKeyToAddress, uint2hex } from 'app/lib/helpers'
import { Ledger, LedgerSigner } from 'app/lib/ledger'
import { OasisTransaction } from 'app/lib/transaction'
import { all, call, delay, fork, put, select, takeEvery } from 'typed-redux-saga'
import { ErrorPayload, WalletError, WalletErrors } from 'types/errors'
import { WalletType } from 'app/state/wallet/types'
import { importAccountsActions } from '.'
import { selectChainContext } from '../network/selectors'
import { ImportAccountsListAccount, ImportAccountsStep } from './types'
import type Transport from '@ledgerhq/hw-transport'
import {
  selectImportAccountHasMissingBalances,
  selectImportAccounts,
  selectImportAccountsOnCurrentPage,
  selectImportAccountsFullList,
  selectImportAccountsPageNumber,
} from './selectors'
import { getAccountBalanceWithFallback } from '../../lib/getAccountBalanceWithFallback'

function* setStep(step: ImportAccountsStep) {
  yield* put(importAccountsActions.setStep(step))
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

/**
 * When deriving accounts, how many accounts do we want to offer on a single page?
 *
 * The limitations are:
 *  - We must consider slow Ledger devices. If we set this too big, the waiting time might be inconvenient.
 *  - We must consider the very limited vertical space available in extension mode. If we set this too big,
 *    the user will need to scroll to reach the open button.
 *
 * Because of the above considerations, we have set this to 4, for now.
 */
export const accountsPerPage = 4

/**
 * How many pages should there be, altogether?
 *
 * We want to offer ~50 accounts, so now se use 12, because 12 x 4 = 48 which is close to 50.
 */
export const numberOfAccountPages = 12

function* enumerateAccountsFromMnemonic(action: PayloadAction<string>) {
  const wallets: ImportAccountsListAccount[] = []
  const mnemonic = action.payload

  try {
    yield* setStep(ImportAccountsStep.LoadingAccounts)
    // Pre-derive all pages of accounts so we don't need to store mnemonic in redux.
    for (let i = 0; i < accountsPerPage * numberOfAccountPages; i++) {
      const signer = yield* call(oasis.hdkey.HDKey.getAccountSigner, mnemonic, i)
      const address = yield* call(publicKeyToAddress, signer.publicKey)

      wallets.push({
        address,
        path: [44, 474, i],
        pathDisplay: `m/44'/474'/${i}'`, // Hardening should match oasis.hdkey.HDKey.getAccountSigner implementation
        privateKey: uint2hex(signer.secretKey),
        publicKey: uint2hex(signer.publicKey),
        selected: i === 0,
        type: WalletType.Mnemonic,
      })
      // Prevent freezing UI rendering. Especially noticeable on a phone.
      yield* delay(0)
    }
    yield* put(importAccountsActions.accountsListed(wallets))
    yield* setStep(ImportAccountsStep.Idle)
    yield* ensureAllBalancesArePresentOnCurrentPage()
  } catch (e: any) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(importAccountsActions.operationFailed(payload))
  }
}

function* fetchBalanceForAccount(account: ImportAccountsListAccount) {
  let currentStep = (yield* select(selectImportAccounts)).step
  if (currentStep === ImportAccountsStep.Idle) {
    yield* setStep(ImportAccountsStep.LoadingBalances)
  }
  const balance = yield* call(getAccountBalanceWithFallback, account.address)
  yield* put(
    importAccountsActions.updateAccountBalance({
      address: account.address,
      balance,
    }),
  )
  currentStep = (yield* select(selectImportAccounts)).step
  const hasMissingBalances = yield* select(selectImportAccountHasMissingBalances)
  if (currentStep === ImportAccountsStep.LoadingBalances && !hasMissingBalances) {
    yield* setStep(ImportAccountsStep.Idle)
  }
}

function* ensureAllBalancesArePresentOnCurrentPage() {
  const accounts = yield* select(selectImportAccountsOnCurrentPage)
  yield* all(accounts.filter(a => !a.balance).map(a => call(fetchBalanceForAccount, a)))
}

/**
 * Enumerate more accounts from Ledger, enough to fill up one page.
 */
function* enumerateAccountsFromLedger() {
  const existingAccounts = yield* select(selectImportAccountsFullList)
  const pageNumber = yield* select(selectImportAccountsPageNumber)
  if (existingAccounts.length >= (pageNumber + 1) * accountsPerPage) {
    // Selected page was already enumerated.
    return
  }
  yield* setStep(ImportAccountsStep.OpeningUSB)
  let transport: Transport | undefined
  try {
    transport = yield* getUSBTransport()
    const existingAccounts = yield* select(selectImportAccountsFullList)
    const start = existingAccounts.length

    yield* setStep(ImportAccountsStep.LoadingAccounts)
    const app = yield* call(Ledger.getOasisApp, transport)
    for (let index = start; index < start + accountsPerPage; index++) {
      const account = yield* call(Ledger.deriveAccountUsingOasisApp, app, index)
      const address = yield* call(publicKeyToAddress, account.publicKey)

      const wallet = {
        publicKey: uint2hex(account.publicKey),
        path: account.path,
        pathDisplay: account.pathDisplay,
        address,
        // We select the first account by default
        selected: index === 0,
        type: WalletType.Ledger,
      } as ImportAccountsListAccount
      yield* put(importAccountsActions.accountGenerated(wallet))
      yield* fork(fetchBalanceForAccount, wallet)
    }
    yield* setStep(ImportAccountsStep.LoadingBalances)
  } catch (e: any) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(importAccountsActions.operationFailed(payload))
  } finally {
    if (transport) {
      try {
        yield* call([transport, transport.close])
      } catch (error) {
        console.log('Error while closing Ledger USB interface:', error)
      }
    }
  }
}

export function* sign<T>(signer: LedgerSigner, tw: oasis.consensus.TransactionWrapper<T>) {
  const transport = yield* getUSBTransport()
  const chainContext = yield* select(selectChainContext)

  signer.setTransport(transport)
  try {
    yield* call([OasisTransaction, OasisTransaction.signUsingLedger], chainContext, signer, tw)
  } finally {
    yield* call([transport, transport.close])
  }
}

export function* importAccountsSaga() {
  yield* takeEvery(importAccountsActions.enumerateAccountsFromLedger, enumerateAccountsFromLedger)
  yield* takeEvery(importAccountsActions.enumerateMoreAccountsFromLedger, enumerateAccountsFromLedger)
  yield* takeEvery(importAccountsActions.enumerateAccountsFromMnemonic, enumerateAccountsFromMnemonic)
  yield* takeEvery(importAccountsActions.setPage, ensureAllBalancesArePresentOnCurrentPage)
}
