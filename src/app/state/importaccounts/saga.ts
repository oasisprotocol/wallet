import { PayloadAction } from '@reduxjs/toolkit'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import * as oasis from '@oasisprotocol/client'
import { hex2uint, publicKeyToAddress, uint2hex } from 'app/lib/helpers'
import { Ledger, LedgerSigner } from 'app/lib/ledger'
import { OasisTransaction } from 'app/lib/transaction'
import { call, fork, put, select, takeEvery } from 'typed-redux-saga'
import { ErrorPayload, WalletError, WalletErrors } from 'types/errors'
import { WalletType } from 'app/state/wallet/types'
import { importAccountsActions } from '.'
import { selectChainContext } from '../network/selectors'
import { getBalance } from '../wallet/saga'
import { ImportAccountsListAccount, ImportAccountsStep } from './types'
import type Transport from '@ledgerhq/hw-transport'
import {
  selectImportAccountHasMissingBalances,
  selectImportAccounts,
  selectImportAccountsOnCurrentPage,
  selectImportAccountsFullList,
  selectImportAccountsPageNumber,
} from './selectors'

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

export const accountsPerPage = 5
export const numberOfAccountPages = 10

function* enumerateAccountsFromMnemonic(action: PayloadAction<string>) {
  const wallets = []
  const mnemonic = action.payload

  try {
    yield* setStep(ImportAccountsStep.LoadingAccounts)
    for (let i = 0; i < accountsPerPage * numberOfAccountPages; i++) {
      const signer = yield* call(oasis.hdkey.HDKey.getAccountSigner, mnemonic, i)
      const address = yield* call(publicKeyToAddress, signer.publicKey)

      wallets.push({
        address,
        path: [44, 474, i],
        privateKey: uint2hex(signer.secretKey),
        publicKey: uint2hex(signer.publicKey),
        selected: i === 0,
        type: WalletType.Mnemonic,
      } as ImportAccountsListAccount)
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
  const balance = yield* call(getBalance, hex2uint(account.publicKey))
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
  const existingAccounts = yield* select(selectImportAccountsOnCurrentPage)
  const accountsWithNoBalance = existingAccounts.filter(a => !a.balance)
  for (let i = 0; i < accountsWithNoBalance.length; i++) {
    yield* fork(fetchBalanceForAccount, accountsWithNoBalance[i])
  }
}

/**
 * Enumerate more accounts from Ledger, enough to fill up one page.
 */
function* enumerateAccountsFromLedger() {
  const existingAccounts = yield* select(selectImportAccountsFullList)
  const pageNumber = yield* select(selectImportAccountsPageNumber)
  if (existingAccounts.length >= (pageNumber + 1) * accountsPerPage) return
  yield* setStep(ImportAccountsStep.OpeningUSB)
  let transport: Transport | undefined
  try {
    transport = yield* getUSBTransport()
    const existingAccounts = yield* select(selectImportAccountsFullList)
    const start = existingAccounts.length

    yield* setStep(ImportAccountsStep.LoadingAccounts)
    for (let index = start; index < start + accountsPerPage; index++) {
      const account = (yield* call(Ledger.enumerateAccounts, transport, 1, index))[0]
      const address = yield* call(publicKeyToAddress, account.publicKey)

      const wallet = {
        publicKey: uint2hex(account.publicKey),
        path: account.path,
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
