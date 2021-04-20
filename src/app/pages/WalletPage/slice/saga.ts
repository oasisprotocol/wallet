import { PayloadAction } from '@reduxjs/toolkit'
import { HDKey } from 'app/lib/hdkey'
import {
  hex2uint,
  isValidAddress,
  publicKeyToAddress,
  shortPublicKey,
  stringBigint2uint,
  uint2bigintString,
  uint2hex,
} from 'app/lib/helpers'
import { nic } from 'app/lib/oasis-client'
import { OasisTransaction, signerFromHDSecret, signerFromPrivateKey } from 'app/lib/transaction'
import { mnemonicToSeedSync } from 'bip39'
import { push } from 'connected-react-router'
import nacl from 'tweetnacl'
import { call, delay, fork, put, race, select, take, takeEvery } from 'typed-redux-saga'
import { WalletErrors, WalletError, ErrorPayload } from 'types/errors'

import { walletActions as actions } from '.'
import { selectAddress, selectPublicKey, selectWallet } from './selectors'
import { SendTransactionPayload, WalletType } from './types'

export function* getWallet() {
  yield* delay(50)

  const publicKey = yield* select(selectPublicKey)
  const short = yield* call(shortPublicKey, hex2uint(publicKey))

  const account = yield* call([nic, nic.stakingAccount], {
    height: 0,
    owner: short,
  })

  const zero = stringBigint2uint('0')

  yield put(
    actions.walletLoaded({
      available: uint2bigintString(account.general?.balance || zero),
      debonding: uint2bigintString(account.escrow?.debonding?.balance || zero),
      escrow: uint2bigintString(account.escrow?.active?.balance || zero),
    }),
  )
}

/**
 * Open wallet from a mnemonic or private key
 */
export function* openWallet() {
  let key
  let publicKey: Uint8Array
  let type: WalletType

  const { mnemonic, privateKey } = yield* race({
    mnemonic: take(actions.openWalletFromMnemonic),
    privateKey: take(actions.openWalletFromPrivateKey),
  })

  if (privateKey) {
    key = privateKey.payload
    type = WalletType.PrivateKey
    publicKey = nacl.sign.keyPair.fromSecretKey(hex2uint(key)).publicKey
  } else if (mnemonic) {
    const seed = mnemonicToSeedSync(mnemonic.payload).slice(0, 32)
    const hdkey = HDKey.fromSeed(seed).derivePath("44'/474'/0'/0'/0'")
    key = uint2hex(hdkey.secret)
    type = WalletType.Mnemonic
    publicKey = hdkey.public()
  }

  const walletAddress = yield* call(publicKeyToAddress, publicKey!)

  yield* put(
    actions.walletOpened({
      address: walletAddress,
      publicKey: uint2hex(publicKey!),
      privateKey: key,
      type: type!,
    }),
  )
}

export function* closeWallet() {
  yield* put(actions.walletClosed())
}

/**
 * Opened wallet saga that
 *
 * - Refreshes every Xs
 * - Sends transactions
 * - Stakes
 * - Signs messages
 * - Verifies signatures
 * - etc...
 */
export function* walletSaga() {
  // Save pubkey and possibly private here
  // const address = yield* select(selectAddress)
  const address = yield* select(selectAddress)
  yield* put(push(`/account/${address}`))
  yield* getWallet()
  yield* takeEvery(actions.sendTransaction, sendTransaction)
}

/**
 * Generate transaction, sign, push to node
 * The amount is converted from float to bigint (x10^9)
 */
export function* sendTransaction(action: PayloadAction<SendTransactionPayload>) {
  const wallet = yield* select(selectWallet)
  const balance = BigInt(wallet.balance.available)
  const privateKey = wallet.privateKey!

  try {
    const amount = BigInt(action.payload.amount * 10 ** 9)
    const recipient = action.payload.to
    const bytes = hex2uint(privateKey!)

    if (!isValidAddress(recipient)) {
      throw new WalletError(WalletErrors.InvalidAddress, 'Invalid address')
    }

    if (amount > balance) {
      throw new WalletError(WalletErrors.InsufficientBalance, 'Insufficient balance')
    }

    if (wallet.address === recipient) {
      throw new WalletError(WalletErrors.CannotSendToSelf, 'Cannot send to your own account')
    }

    let signer
    if (wallet.type === WalletType.PrivateKey) {
      // yield* call(sendFromPrivateKey, bytes, recipient, amount, nonce)
      signer = yield* call(signerFromPrivateKey, bytes)
    } else if (wallet.type === WalletType.Mnemonic) {
      signer = yield* call(signerFromHDSecret, bytes)
    } else {
      throw new WalletError(WalletErrors.InvalidPrivateKey, 'Invalid private key')
    }

    // Build, sign, submit
    const tw = yield* call(OasisTransaction.buildTransfer, signer, recipient, amount)
    yield* call(OasisTransaction.sign, signer, tw)
    yield* call(OasisTransaction.submit, tw)

    // Notify that the transaction was a success
    yield* put(
      actions.transactionSent({ amount: action.payload.amount, from: wallet.address, to: recipient }),
    )
  } catch (e) {
    console.log('Transaction error', e)
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(actions.transactionFailed(payload))
  }
}

export function* rootWalletSaga() {
  while (true) {
    // Wait for an openWallet action (Mnemonic or PrivateKey)
    yield* openWallet()

    // Start the wallet saga in parallel
    const wallet = yield* fork(walletSaga)

    // Meanwhile, wait for a close action
    // @todo : Add race here to auto-close wallet after X minutes
    yield* take(actions.closeWallet)
    yield* closeWallet()

    // And cancel pending sagas
    yield wallet.cancel()
  }
}
