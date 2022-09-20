import { PayloadAction } from '@reduxjs/toolkit'
import { hex2uint, parseRpcBalance, publicKeyToAddress, shortPublicKey, uint2hex } from 'app/lib/helpers'
import nacl from 'tweetnacl'
import { call, delay, fork, put, select, take, takeEvery } from 'typed-redux-saga'
import { selectSelectedAccounts } from 'app/state/importaccounts/selectors'

import { walletActions } from '.'
import { ImportAccountsListAccount } from '../importaccounts/types'
import { getOasisNic } from '../network/saga'
import { transactionActions } from '../transaction'
import { selectAddress, selectWallets } from './selectors'
import { AddWalletPayload, Wallet, WalletType } from './types'

/**
 * Opened wallet saga
 * Will later be used to sign arbitrary messages
 */
export function* walletSaga() {}

export function* rootWalletSaga() {
  // Wait for an openWallet action (Mnemonic, Private Key, Ledger) and add them if requested
  yield* takeEvery(walletActions.openWalletFromPrivateKey, openWalletFromPrivateKey)
  yield* takeEvery(walletActions.openWalletFromMnemonic, openWalletFromMnemonic)
  yield* takeEvery(walletActions.openWalletsFromLedger, openWalletsFromLedger)
  yield* takeEvery(walletActions.addWallet, addWallet)

  // Reload balance of matching wallets when a transaction occurs
  yield* fork(refreshAccountOnTransaction)
  yield* takeEvery(walletActions.fetchWallet, loadWallet)

  // Start the wallet saga in parallel
  yield* fork(walletSaga)

  // Listen to closeWallet
  yield* takeEvery(walletActions.closeWallet, closeWallet)
}

export function* getBalance(publicKey: Uint8Array) {
  const nic = yield* call(getOasisNic)
  const short = yield* call(shortPublicKey, publicKey)
  const account = yield* call([nic, nic.stakingAccount], {
    height: 0,
    owner: short,
  })

  return parseRpcBalance(account)
}

function* getWalletByAddress(address: string) {
  const wallets = yield* select(selectWallets)
  const wallet = Object.values(wallets).find(w => w.address === address)

  return wallet ? wallet : undefined
}
/**
 * Take multiple ledger accounts that we want to open
 */
export function* openWalletsFromLedger() {
  const accounts: ImportAccountsListAccount[] = yield* select(selectSelectedAccounts)
  for (const account of accounts) {
    yield* put(
      walletActions.addWallet({
        address: account.address,
        publicKey: account.publicKey,
        type: WalletType.Ledger,
        balance: account.balance,
        path: account.path,
        selectImmediately: account === accounts[0], // Select first
      }),
    )
  }
}

export function* openWalletFromPrivateKey({ payload: privateKey }: PayloadAction<string>) {
  const type = WalletType.PrivateKey
  const publicKeyBytes = nacl.sign.keyPair.fromSecretKey(hex2uint(privateKey)).publicKey
  const walletAddress = yield* call(publicKeyToAddress, publicKeyBytes)
  const publicKey = uint2hex(publicKeyBytes)
  const balance = yield* call(getBalance, publicKeyBytes)

  yield* put(
    walletActions.addWallet({
      address: walletAddress,
      publicKey,
      privateKey,
      type: type!,
      balance,
      selectImmediately: true,
    }),
  )
}

export function* openWalletFromMnemonic() {
  const accounts: ImportAccountsListAccount[] = yield* select(selectSelectedAccounts)
  for (const account of accounts) {
    yield* put(
      walletActions.addWallet({
        address: account.address,
        balance: account.balance,
        path: account.path,
        privateKey: account.privateKey,
        publicKey: account.publicKey,
        type: account.type,
        selectImmediately: account === accounts[0], // Select first
      }),
    )
  }
}

/**
 * Adds a wallet to the existing wallets
 * If the wallet exists already, do nothing
 * If it has "selectImmediately", we select it immediately
 */
export function* addWallet({ payload }: PayloadAction<AddWalletPayload>) {
  const { selectImmediately, ...newWallet } = payload
  const existingWallet = yield* call(getWalletByAddress, newWallet.address)
  if (!existingWallet) {
    yield* put(walletActions.walletOpened(newWallet))
  }

  if (selectImmediately) {
    yield* put(walletActions.selectWallet(undefined)) // Workaround so useRouteRedirects detects selecting the same account
    yield* delay(1) // Workaround to avoid React batching state updates
    yield* put(walletActions.selectWallet(newWallet.address))
  }
}

export function* closeWallet() {
  yield* put(walletActions.walletClosed())
}

function* loadWallet(action: PayloadAction<Wallet>) {
  const wallet = action.payload
  const balance = yield* call(getBalance, hex2uint(wallet.publicKey))
  yield* put(
    walletActions.updateBalance({
      address: wallet.address,
      balance,
    }),
  )
}

/**
 * When a transaction is done, and it is related to the account we currently have in state
 * refresh the data.
 */
function* refreshAccountOnTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.transactionSent)
    if (payload.type !== 'transfer') {
      // @TODO: This should be done for other types of transactions too
      return
    }

    const from = yield* select(selectAddress)
    const to = payload.to

    const wallets = yield* select(selectWallets)
    const matchingWallets = Object.values(wallets).filter(w => w.address === to || w.address === from)
    for (const wallet of matchingWallets) {
      yield* put(walletActions.fetchWallet(wallet))
    }
  }
}
