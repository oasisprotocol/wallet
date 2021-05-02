import { Signer } from '@oasisprotocol/client/dist/signature'
import { PayloadAction } from '@reduxjs/toolkit'
import { hex2uint, isValidAddress } from 'app/lib/helpers'
import { LedgerSigner } from 'app/lib/ledger'
import { OasisTransaction, signerFromHDSecret, signerFromPrivateKey } from 'app/lib/transaction'
import { call, put, race, select, take } from 'typed-redux-saga'
import { ErrorPayload, WalletError, WalletErrors } from 'types/errors'

import { transactionActions } from '.'
import { sign } from '../ledger/saga'
import { getOasisNic } from '../network/saga'
import { selectActiveWallet } from '../wallet/selectors'
import { WalletType } from '../wallet/types'
import { SendTransactionPayload, TransactionStep } from './types'

export function* setStep(step: TransactionStep) {
  yield* put(transactionActions.setStep(step))
}

/**
 * When we are previewing a transaction, await either a confirm action,
 * or an abort action.
 */
export function* expectConfirmation() {
  const { confirm } = yield* race({
    confirm: take(transactionActions.confirmTransaction),
    abort: take(transactionActions.abortTransaction),
  })

  if (confirm) {
    return true
  } else {
    return false
  }
}

/**
 * Generate transaction, sign, push to node
 * The amount is converted from float to bigint (x10^9)
 *
 * Build the transaction (and validate it client-side)
 * Wait for either confirm or cancel, exit saga on cancel
 *
 */
export function* sendTransaction(action: PayloadAction<SendTransactionPayload>) {
  const wallet = yield* select(selectActiveWallet)
  const nic = yield* call(getOasisNic)

  try {
    if (!wallet) {
      throw new WalletError(WalletErrors.NoOpenWallet, 'Cannot send transaction without an active wallet')
    }

    const balance = BigInt(wallet.balance.available)
    const privateKey = wallet.privateKey!

    yield* setStep(TransactionStep.Building)
    const amount = BigInt(action.payload.amount * 10 ** 9)
    const recipient = action.payload.to

    if (!isValidAddress(recipient)) {
      throw new WalletError(WalletErrors.InvalidAddress, 'Invalid address')
    }

    if (amount > balance) {
      throw new WalletError(WalletErrors.InsufficientBalance, 'Insufficient balance')
    }

    if (wallet.address === recipient) {
      throw new WalletError(WalletErrors.CannotSendToSelf, 'Cannot send to your own account')
    }

    let signer: Signer | LedgerSigner
    if (wallet.type === WalletType.PrivateKey) {
      const bytes = hex2uint(privateKey!)
      signer = yield* call(signerFromPrivateKey, bytes)
    } else if (wallet.type === WalletType.Mnemonic) {
      const bytes = hex2uint(privateKey!)
      signer = yield* call(signerFromHDSecret, bytes)
    } else if (wallet.type === WalletType.Ledger) {
      signer = new LedgerSigner(wallet)
    } else {
      throw new WalletError(WalletErrors.InvalidPrivateKey, 'Invalid private key')
    }

    yield* setStep(TransactionStep.Preview)
    const confirmed = yield* expectConfirmation()
    if (!confirmed) {
      yield* put(transactionActions.clearTransaction())
      return
    }

    yield* setStep(TransactionStep.Signing)
    const tw = yield* call(OasisTransaction.buildTransfer, nic, signer as Signer, recipient, amount)

    if (wallet.type === WalletType.Ledger) {
      yield* call(sign, signer as LedgerSigner, tw)
    } else {
      yield* call(OasisTransaction.sign, nic, signer as Signer, tw)
    }

    yield* setStep(TransactionStep.Submitting)
    yield* call(OasisTransaction.submit, nic, tw)

    // Notify that the transaction was a success
    yield* put(
      transactionActions.transactionSent({
        amount: action.payload.amount,
        from: wallet.address,
        to: recipient,
      }),
    )
  } catch (e) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(transactionActions.transactionFailed(payload))
  }
}

export function* transactionSaga() {
  // yield takeLatest(actions.someAction.type, doSomething);
}
