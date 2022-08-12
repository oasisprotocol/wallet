import { client } from '@oasisprotocol/client'
import { Signer } from '@oasisprotocol/client/dist/signature'
import BigNumber from 'bignumber.js'
import { PayloadAction } from '@reduxjs/toolkit'
import { hex2uint, isValidAddress, uint2bigintString, parseRoseStringToBigNumber } from 'app/lib/helpers'
import { LedgerSigner } from 'app/lib/ledger'
import { OasisTransaction, signerFromPrivateKey, TW } from 'app/lib/transaction'
import { call, put, race, select, take, takeEvery } from 'typed-redux-saga'
import { ErrorPayload, ExhaustedTypeError, WalletError, WalletErrors } from 'types/errors'
import { transactionActions } from '.'
import { sign } from '../ledger/saga'
import { getOasisNic } from '../network/saga'
import { selectAccountAddress } from '../account/selectors'
import { Allowance } from '../account/types'
import { selectAccountAllowances } from '../account/selectors'
import { selectChainContext } from '../network/selectors'
import { selectActiveWallet } from '../wallet/selectors'
import { Wallet, WalletType } from '../wallet/types'
import { TransactionPayload, TransactionStep } from './types'
import { Runtime } from '../paratimes/types'
import { consensusDecimals } from '../../../config'

export function* transactionSaga() {
  yield* takeEvery(transactionActions.sendTransaction, doTransaction)
  yield* takeEvery(transactionActions.addEscrow, doTransaction)
  yield* takeEvery(transactionActions.reclaimEscrow, doTransaction)
}

function* setStep(step: TransactionStep) {
  yield* put(transactionActions.setStep(step))
}

/**
 * When we are previewing a transaction, await either a confirm action,
 * or an abort action.
 */
function* expectConfirmation() {
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
 * Yields the appropriate signer for the currently active wallet
 */
function* getSigner() {
  const wallet = yield* select(selectActiveWallet)
  if (!wallet) {
    throw new WalletError(WalletErrors.NoOpenWallet, 'Cannot send transaction without an active wallet')
  }

  const privateKey = wallet.privateKey!

  let signer: Signer | LedgerSigner
  if (wallet.type === WalletType.PrivateKey || wallet.type === WalletType.Mnemonic) {
    const bytes = hex2uint(privateKey!)
    signer = yield* call(signerFromPrivateKey, bytes)
  } else if (wallet.type === WalletType.Ledger) {
    signer = new LedgerSigner(wallet)
  } else {
    throw new ExhaustedTypeError('Invalid wallet type', wallet.type)
  }

  return signer
}

function* prepareTransfer(signer: Signer, amount: bigint, to: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, to)
  yield* call(assertSufficientBalance, amount)
  yield* call(assertRecipientNotSelf, to)

  return yield* call(OasisTransaction.buildTransfer, nic, signer as Signer, to, amount)
}

function* prepareStakingAllowTransfer(signer: Signer, amount: bigint, to: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, to)
  yield* call(assertSufficientBalance, amount)
  yield* call(assertRecipientNotSelf, to)

  return yield* call(OasisTransaction.buildStakingAllowTransfer, nic, signer as Signer, to, amount)
}

function* prepareParatimeTransfer(
  nic: client.NodeInternal,
  signer: Signer,
  amount: string,
  to: string,
  from: string,
  runtime: Runtime,
) {
  yield* call(assertWalletIsOpen)
  yield* call(assertSufficientBalance, BigInt(parseRoseStringToBigNumber(amount).toString()))

  return yield* call(
    OasisTransaction.buildParatimeTransfer,
    nic,
    signer,
    to,
    from,
    amount,
    runtime.id,
    runtime.decimals,
  )
}

function* prepareAddEscrow(signer: Signer, amount: bigint, validator: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, validator)
  yield* call(assertSufficientBalance, amount)

  return yield* call(OasisTransaction.buildAddEscrow, nic, signer as Signer, validator, amount)
}

function* prepareReclaimEscrow(signer: Signer, shares: bigint, validator: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, validator)

  return yield* call(OasisTransaction.buildReclaimEscrow, nic, signer as Signer, validator, shares)
}

/**
 * Generate transaction, sign, push to node
 *
 * Build the transaction (and validate it client-side)
 * Wait for either confirm or cancel, exit saga on cancel
 */
export function* doTransaction(action: PayloadAction<TransactionPayload>) {
  const wallet = yield* select(selectActiveWallet)
  const nic = yield* call(getOasisNic)
  const chainContext = yield* select(selectChainContext)

  try {
    yield* setStep(TransactionStep.Building)

    yield* call(assertWalletIsOpen)
    const activeWallet = wallet as Wallet
    const signer = yield* getSigner()

    let tw: TW<any>
    switch (action.payload.type) {
      case 'transfer':
        tw = yield* call(prepareTransfer, signer as Signer, BigInt(action.payload.amount), action.payload.to)
        break

      case 'addEscrow':
        tw = yield* call(
          prepareAddEscrow,
          signer as Signer,
          BigInt(action.payload.amount),
          action.payload.validator,
        )
        break

      case 'reclaimEscrow':
        tw = yield* call(
          prepareReclaimEscrow,
          signer as Signer,
          BigInt(action.payload.shares),
          action.payload.validator,
        )
        break

      default:
        throw new ExhaustedTypeError('Unsupported transaction type', action.payload)
    }

    yield* put(
      transactionActions.updateTransactionPreview({
        transaction: action.payload,
        fee: uint2bigintString(tw.transaction.fee?.amount!),
        gas: BigInt(tw.transaction.fee?.gas!).toString(),
      }),
    )

    yield* setStep(TransactionStep.Preview)
    const confirmed = yield* expectConfirmation()
    if (!confirmed) {
      yield* put(transactionActions.clearTransaction())
      return
    }

    yield* setStep(TransactionStep.Signing)

    if (activeWallet.type === WalletType.Ledger) {
      yield* call(sign, signer as LedgerSigner, tw)
    } else {
      yield* call(OasisTransaction.sign, chainContext, signer as Signer, tw)
    }

    yield* setStep(TransactionStep.Submitting)
    yield* call(OasisTransaction.submit, nic, tw)

    // Notify that the transaction was a success
    yield* put(transactionActions.transactionSent(action.payload))
  } catch (e: any) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(transactionActions.transactionFailed(payload))
  }
}

function* getAllowanceDifference(amount: string, runtimeAddress: string) {
  const allowances = yield* select(selectAccountAllowances)
  const allowance = allowances.find((item: Allowance) => item.address === runtimeAddress)?.amount || 0
  return new BigNumber(amount).minus(allowance)
}

export function* submitParaTimeTransaction(runtime: Runtime, amount: string, recipient: string) {
  const accountAddress = yield* select(selectAccountAddress)
  const nic = yield* call(getOasisNic)
  const chainContext = yield* select(selectChainContext)
  const signer = yield* getSigner()
  const allowanceDifference = yield* call(getAllowanceDifference, amount, runtime.address)

  if (allowanceDifference.gte(0)) {
    const tw = yield* call(
      prepareStakingAllowTransfer,
      signer as Signer,
      BigInt(allowanceDifference.shiftedBy(consensusDecimals).toString()),
      runtime.address,
    )
    yield* call(OasisTransaction.sign, chainContext, signer as Signer, tw)
    yield* call(OasisTransaction.submit, nic, tw)
  }

  const tw = yield* call(
    prepareParatimeTransfer,
    nic,
    signer as Signer,
    amount,
    recipient,
    accountAddress,
    runtime,
  )

  yield* call(OasisTransaction.signParaTime, chainContext, signer as Signer, tw)
  yield* call(OasisTransaction.submit, nic, tw)
}

function* assertWalletIsOpen() {
  const wallet = yield* select(selectActiveWallet)

  if (!wallet) {
    throw new WalletError(WalletErrors.NoOpenWallet, 'Cannot send transaction without an active wallet')
  }
}

function assertValidAddress(address: string) {
  if (!isValidAddress(address)) {
    throw new WalletError(WalletErrors.InvalidAddress, 'Invalid address')
  }
}

function* assertSufficientBalance(amount: bigint) {
  const wallet = yield* select(selectActiveWallet)

  const balance = BigInt(wallet!.balance.available)
  if (amount > balance) {
    throw new WalletError(WalletErrors.InsufficientBalance, 'Insufficient balance')
  }
}

function* assertRecipientNotSelf(recipient: string) {
  const wallet = yield* select(selectActiveWallet)

  if (wallet!.address === recipient) {
    throw new WalletError(WalletErrors.CannotSendToSelf, 'Cannot send to your own account')
  }
}
