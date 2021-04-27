// import { take, call, put, select, takeLatest } from 'redux-saga/effects';
// import { accountActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit'
import { accounts, operations } from 'app/lib/api'
import { all, call, fork, put, select, take, takeEvery } from 'typed-redux-saga'

import { accountActions as actions } from '.'
import { transactionActions } from '../transaction'
import { selectAccountAddress } from './selectors'

/**
 * Waits for a LoadAccount action with a specific address,
 * and hydrate the state accordingly
 */
function* loadAccount(action: PayloadAction<string>) {
  yield* put(actions.setLoading(true))
  const address = action.payload
  const result = yield* all({
    account: call([accounts, accounts.getAccount], { accountId: address }),
    transactions: call([operations, operations.getTransactionsList], { accountId: address }),
  })
  yield put(actions.accountLoaded(result.account))
  yield put(actions.transactionsLoaded(result.transactions))
  yield* put(actions.setLoading(false))
}

/**
 * When a transaction is done, and it is related to the account we currently have in state
 * refresh the data.
 */
function* refreshAccountOnTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.transactionSent)
    const currentAccount = yield* select(selectAccountAddress)

    const from = payload.from
    const to = payload.to

    if (currentAccount === from || currentAccount === to) {
      // Refresh current account
      yield* put(actions.fetchAccount(currentAccount))
    }
  }
}

export function* accountSaga() {
  yield* fork(refreshAccountOnTransaction)
  yield* takeEvery(actions.fetchAccount, loadAccount)
}
