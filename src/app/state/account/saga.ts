import { PayloadAction } from '@reduxjs/toolkit'
import { addressToPublicKey, parseRpcBalance } from 'app/lib/helpers'
import { all, call, fork, join, put, select, take, takeLatest } from 'typed-redux-saga'
import { WalletError, WalletErrors } from 'types/errors'

import { accountActions } from '.'
import { getExplorerAPIs, getOasisNic } from '../network/saga'
import { stakingActions } from '../staking'
import { transactionActions } from '../transaction'
import { selectAddress } from '../wallet/selectors'
import { selectAccountAddress } from './selectors'

const TRANSACTIONS_LIMIT = 20

function* getBalanceGRPC(address: string) {
  const nic = yield* call(getOasisNic)
  const publicKey = yield* call(addressToPublicKey, address)
  const account = yield* call([nic, nic.stakingAccount], { owner: publicKey, height: 0 })
  const balance = parseRpcBalance(account)
  return {
    address,
    available: balance.available,
    delegations: null,
    debonding: null,
    total: null,
  }
}

export function* fetchAccount(action: PayloadAction<string>) {
  const address = action.payload

  yield* put(accountActions.setLoading(true))
  const { getAccount, getTransactionsList } = yield* call(getExplorerAPIs)

  yield* all([
    join(
      yield* fork(function* () {
        try {
          const account = yield* call(getAccount, address)
          yield* put(accountActions.accountLoaded(account))
        } catch (apiError: any) {
          console.error('get account failed, continuing to RPC fallback.', apiError)
          try {
            const account = yield* call(getBalanceGRPC, address)
            yield* put(accountActions.accountLoaded(account))
          } catch (rpcError) {
            console.error('get account with RPC failed, continuing without updated account.', rpcError)
            if (apiError instanceof WalletError) {
              yield* put(accountActions.accountError({ code: apiError.type, message: apiError.message }))
            } else {
              yield* put(
                accountActions.accountError({
                  code: WalletErrors.UnknownError,
                  message: apiError.message,
                }),
              )
            }
          }
        }
      }),
    ),
    join(
      yield* fork(function* () {
        try {
          const transactions = yield* call(getTransactionsList, {
            accountId: address,
            limit: TRANSACTIONS_LIMIT,
          })
          yield* put(accountActions.transactionsLoaded(transactions))
        } catch (e: any) {
          console.error('get transactions list failed, continuing without updated list.', e)
          if (e instanceof WalletError) {
            yield* put(accountActions.transactionsError({ code: e.type, message: e.message }))
          } else {
            yield* put(
              accountActions.transactionsError({ code: WalletErrors.UnknownError, message: e.message }),
            )
          }
        }
      }),
    ),
  ])

  yield* put(accountActions.setLoading(false))
}

/**
 * When a transaction is done, and it is related to the account we currently have in state
 * refresh the data.
 */
export function* refreshAccountOnTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.transactionSent)
    const otherAddress = payload.type === 'transfer' ? payload.to : payload.validator
    yield* call(refreshAccount, otherAddress)
  }
}

export function* refreshAccountOnParaTimeTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.paraTimeTransactionSent)

    yield* call(refreshAccount, payload)
  }
}

function* refreshAccount(address: string) {
  const from = yield* select(selectAddress)
  const currentAccount = yield* select(selectAccountAddress)
  if (currentAccount === from || currentAccount === address) {
    yield* put(accountActions.fetchAccount(currentAccount))
    yield* put(stakingActions.fetchAccount(currentAccount))
  }
}

export function* accountSaga() {
  yield* fork(refreshAccountOnTransaction)
  yield* fork(refreshAccountOnParaTimeTransaction)
  yield* takeLatest(accountActions.fetchAccount, fetchAccount)
}
