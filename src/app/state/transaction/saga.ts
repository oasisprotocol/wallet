import { client, misc } from '@oasisprotocol/client'
import { ContextSigner } from '@oasisprotocol/client/dist/signature'
import { PayloadAction } from '@reduxjs/toolkit'
import {
  hex2uint,
  isValidAddress,
  parseRoseStringToBaseUnitString,
  publicKeyToAddress,
  uint2bigintString,
} from 'app/lib/helpers'
import { LedgerSigner } from 'app/lib/ledger'
import { OasisTransaction, signerFromEthPrivateKey, signerFromPrivateKey, TW } from 'app/lib/transaction'
import { getEvmBech32Address, privateToEthAddress } from 'app/lib/eth-helpers'
import { call, put, race, select, take, takeEvery } from 'typed-redux-saga'
import { ErrorPayload, ExhaustedTypeError, WalletError, WalletErrors } from 'types/errors'
import { transactionActions } from '.'
import { sign } from '../importaccounts/saga'
import { getChainContext, getOasisNic } from '../network/saga'
import { selectAccountAddress, selectAccountAllowances } from '../account/selectors'
import { selectSelectedNetwork } from '../network/selectors'
import { selectActiveWallet } from '../wallet/selectors'
import { Wallet, WalletType } from '../wallet/types'
import { Transaction, TransactionPayload, TransactionStatus, TransactionStep, TransactionType } from './types'
import { ParaTimeTransaction, Runtime, TransactionTypes } from '../paratimes/types'
import { accountActions } from '../account'
import { hashSignedTransaction } from '@oasisprotocol/client/dist/consensus'

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

  let signer: ContextSigner
  if (wallet.type === WalletType.PrivateKey || wallet.type === WalletType.Mnemonic) {
    const bytes = hex2uint(privateKey!)
    signer = yield* call(signerFromPrivateKey, bytes)
  } else if (wallet.type === WalletType.UsbLedger || wallet.type === WalletType.BleLedger) {
    signer = new LedgerSigner(wallet)
  } else {
    throw new ExhaustedTypeError('Invalid wallet type', wallet.type)
  }

  return signer
}

function* prepareTransfer(signer: ContextSigner, amount: bigint, to: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, to)
  yield* call(assertSufficientBalance, amount)
  yield* call(assertRecipientNotSelf, to)

  return yield* call(OasisTransaction.buildTransfer, nic, signer as ContextSigner, to, amount)
}

/**
 * Set allowance for ParaTime transaction
 */
function* prepareStakingAllowTransfer(signer: ContextSigner, amount: bigint, to: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, to)
  yield* call(assertSufficientBalance, amount)
  yield* call(assertRecipientNotSelf, to)

  return yield* call(OasisTransaction.buildStakingAllowTransfer, nic, signer as ContextSigner, to, amount)
}

function* prepareParatimeTransfer(
  nic: client.NodeInternal,
  signer: ContextSigner,
  transaction: ParaTimeTransaction,
  from: string,
  runtime: Runtime,
) {
  yield* call(assertWalletIsOpen)
  if (transaction.type === TransactionTypes.Deposit) {
    yield* call(assertSufficientBalance, BigInt(parseRoseStringToBaseUnitString(transaction.amount)))
  }

  return yield* call(OasisTransaction.buildParaTimeTransfer, nic, signer, transaction, from, runtime)
}

function* prepareAddEscrow(signer: ContextSigner, amount: bigint, validator: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, validator)
  yield* call(assertSufficientBalance, amount)

  return yield* call(OasisTransaction.buildAddEscrow, nic, signer as ContextSigner, validator, amount)
}

function* prepareReclaimEscrow(signer: ContextSigner, shares: bigint, validator: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, validator)

  return yield* call(OasisTransaction.buildReclaimEscrow, nic, signer as ContextSigner, validator, shares)
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
  const chainContext = yield* call(getChainContext)
  const networkType = yield* select(selectSelectedNetwork)

  try {
    yield* setStep(TransactionStep.Building)

    yield* call(assertWalletIsOpen)
    const activeWallet = wallet as Wallet
    const signer = yield* getSigner()

    let tw: TW<any>
    switch (action.payload.type) {
      case 'transfer':
        tw = yield* call(prepareTransfer, signer, BigInt(action.payload.amount), action.payload.to)
        break

      case 'addEscrow':
        tw = yield* call(prepareAddEscrow, signer, BigInt(action.payload.amount), action.payload.validator)
        break

      case 'reclaimEscrow':
        tw = yield* call(
          prepareReclaimEscrow,
          signer,
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

    yield* call(sign, signer, tw)

    yield* setStep(TransactionStep.Submitting)
    yield* call(OasisTransaction.submit, nic, tw)

    // Notify that the transaction was a success
    yield* put(transactionActions.transactionSent(action.payload))

    const hash = yield* call([tw, tw.hash])

    const transaction: Transaction = {
      hash,
      type: tw.transaction.method as TransactionType,
      from: activeWallet.address,
      amount: action.payload.amount,
      to: undefined,
      ...(action.payload.type === 'transfer'
        ? {
            to: action.payload.to,
          }
        : {}),
      ...(action.payload.type === 'addEscrow'
        ? {
            to: action.payload.validator,
          }
        : {}),
      ...(action.payload.type === 'reclaimEscrow'
        ? {
            to: action.payload.validator,
          }
        : {}),
      status: TransactionStatus.Pending,
      fee: undefined,
      level: undefined,
      round: undefined,
      runtimeId: undefined,
      runtimeName: undefined,
      timestamp: undefined,
      nonce: undefined,
    }

    yield* put(accountActions.addPendingTransaction({ transaction, networkType }))
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

export function* getAllowanceDifference(amount: string, runtimeAddress: string) {
  const allowances = yield* select(selectAccountAllowances)
  const allowance = allowances
    ? allowances.find(item => item.address === runtimeAddress)?.amount ?? 0 // No allowance set yet
    : 0 // Allowance info is missing

  return BigInt(parseRoseStringToBaseUnitString(amount)) - BigInt(allowance)
}

export function* setAllowance(
  nic: client.NodeInternal,
  chainContext: string,
  amount: string,
  runtimeAddress: string,
) {
  const allowanceDifference = yield* call(getAllowanceDifference, amount, runtimeAddress)
  if (allowanceDifference > 0n) {
    const signer = yield* getSigner()
    const tw = yield* call(prepareStakingAllowTransfer, signer, allowanceDifference, runtimeAddress)
    yield* call(sign, signer, tw)
    yield* call(OasisTransaction.submit, nic, tw)

    yield* put(
      accountActions.addPendingTransaction({
        transaction: {
          hash: yield* call([tw, tw.hash]),
          type: tw.transaction.method as TransactionType,
          from: yield* call(publicKeyToAddress, signer.public()),
          amount: allowanceDifference.toString(),
          to: undefined,
          status: TransactionStatus.Pending,
          fee: undefined,
          level: undefined,
          round: undefined,
          runtimeId: undefined,
          runtimeName: undefined,
          timestamp: undefined,
          nonce: undefined,
        },
        networkType: yield* select(selectSelectedNetwork),
      }),
    )
  }
}

export function* submitParaTimeTransaction(runtime: Runtime, transaction: ParaTimeTransaction) {
  const fromOasisAddress = transaction.ethPrivateKey
    ? yield* call(getEvmBech32Address, privateToEthAddress(transaction.ethPrivateKey))
    : yield* select(selectAccountAddress)
  const fromAddress = transaction.ethPrivateKey
    ? privateToEthAddress(transaction.ethPrivateKey)
    : yield* select(selectAccountAddress)

  const nic = yield* call(getOasisNic)
  const chainContext = yield* call(getChainContext)
  const paraTimeTransactionSigner = transaction.ethPrivateKey
    ? yield* call(signerFromEthPrivateKey, misc.fromHex(transaction.ethPrivateKey))
    : yield* getSigner()

  if (transaction.type === TransactionTypes.Deposit) {
    yield* call(setAllowance, nic, chainContext, transaction.amount, runtime.address)
  }

  const rtw = yield* call(
    prepareParatimeTransfer,
    nic,
    paraTimeTransactionSigner,
    transaction,
    fromOasisAddress,
    runtime,
  )

  debugger
  yield* call(sign, paraTimeTransactionSigner, rtw)
  yield* call(OasisTransaction.submit, nic, rtw)
  yield* put(transactionActions.paraTimeTransactionSent(transaction.recipient))

  const hash = yield* call(hashSignedTransaction, rtw.unverifiedTransaction as any) // TODO use rtw.hash when added
  yield* put(
    accountActions.addPendingTransaction({
      transaction: {
        hash: hash,
        type: rtw.transaction.call.method as TransactionType,
        from: fromAddress,
        amount: parseRoseStringToBaseUnitString(transaction.amount),
        to: transaction.recipient,
        status: TransactionStatus.Pending,
        fee: undefined,
        level: undefined,
        round: undefined,
        runtimeId: undefined,
        runtimeName: undefined,
        timestamp: undefined,
        nonce: undefined,
      },
      networkType: yield* select(selectSelectedNetwork),
    }),
  )
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
  // If balance is missing, allow this to pass. It's just more likely that transaction will fail after submitting.
  if (wallet?.balance?.available == null) return

  const balance = BigInt(wallet.balance.available)
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
