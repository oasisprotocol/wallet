import { PayloadAction } from '@reduxjs/toolkit'
import { addressToPublicKey } from 'app/lib/helpers'
import { all, call, fork, join, put, select, take, takeEvery } from 'typed-redux-saga'

import { accountActions as actions } from '.'
import { getExplorerAPIs, getOasisNic } from '../network/saga'
import { stakingActions } from '../staking'
import { transactionActions } from '../transaction'
import { selectAddress } from '../wallet/selectors'
import { selectAccountAddress } from './selectors'

/**
 * Waits for a LoadAccount action with a specific address,
 * and hydrate the state accordingly
 */
function* loadAccount(action: PayloadAction<string>) {
  const address = action.payload

  yield* put(actions.setLoading(true))
  const nic = yield* call(getOasisNic)
  const publicKey = yield* call(addressToPublicKey, address)
  const { accounts, operations } = yield* call(getExplorerAPIs)

  yield* all([
    join(
      yield* fork(function* () {
        let account
        try {
          account = yield* call([accounts, accounts.getAccount], { accountId: address })
        } catch (e) {
          console.error('get account, continuing without updated account.', e)
          yield put(actions.accountError('' + e))
          return
        }
        yield put(actions.accountLoaded(account))
      }),
    ),
    join(
      yield* fork(function* () {
        let transactions
        try {
          transactions = yield* call([operations, operations.getTransactionsList], { accountId: address })
        } catch (e) {
          console.error('get transactions list failed, continuing without updated list.', e)
          yield put(actions.transactionsError('' + e))
          return
        }
        yield put(actions.transactionsLoaded(transactions))
      }),
    ),
    //@TODO Use this for now instead of oasis-explorer because of the ongoing
    //issue with staking balances being wrong
    call([nic, nic.stakingAccount], { owner: publicKey, height: 0 }),
  ])

  yield* put(actions.setLoading(false))
}

/**
 * When a transaction is done, and it is related to the account we currently have in state
 * refresh the data.
 */
function* refreshAccountOnTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.transactionSent)
    const from = yield* select(selectAddress)
    let otherAddress: string

    if (payload.type === 'transfer') {
      otherAddress = payload.to
    } else {
      otherAddress = payload.validator
    }

    const currentAccount = yield* select(selectAccountAddress)
    if (currentAccount === from || currentAccount === otherAddress) {
      // Refresh current account
      yield* put(actions.fetchAccount(currentAccount))
      yield* put(stakingActions.fetchAccount(currentAccount))
    }
  }
}

export function* accountSaga() {
  yield* fork(refreshAccountOnTransaction)
  yield* takeEvery(actions.fetchAccount, loadAccount)
}
