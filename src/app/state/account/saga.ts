// import { take, call, put, select, takeLatest } from 'redux-saga/effects';
// import { accountActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit'
import { all, call, fork, put, select, take, takeEvery } from 'typed-redux-saga'

import { accountActions as actions } from '.'
import { getExplorerAPIs } from '../network/saga'
import { stakingActions } from '../staking'
import { transactionActions } from '../transaction'
import { selectAddress } from '../wallet/selectors'
import { selectAccountAddress } from './selectors'

/**
 * Waits for a LoadAccount action with a specific address,
 * and hydrate the state accordingly
 */
function* loadAccount(action: PayloadAction<string>) {
  yield* put(actions.setLoading(true))
  const { accounts, operations } = yield* call(getExplorerAPIs)

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
