import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { stakingActions } from 'app/state/staking'
import { walletActions } from 'app/state/wallet'
import { transactionActions } from 'app/state/transaction'
import { accountActions } from '.'
import {
  accountSaga,
  fetchAccount,
  refreshAccountOnTransaction,
  refreshAccountOnParaTimeTransaction,
  fetchingOnAccountPage,
} from './saga'
import { DeepPartialRootState } from 'types/RootState'
import * as matchers from 'redux-saga-test-plan/matchers'
import { getExplorerAPIs } from '../network/saga'
import { getAccountBalanceWithFallback } from '../../lib/getAccountBalanceWithFallback'
import delayP from '@redux-saga/delay-p'

const address = 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'
const state: DeepPartialRootState = {
  account: { address },
  wallet: {
    selectedWallet: 'dummy',
    wallets: {
      dummy: {
        address,
      },
    },
  },
}

describe('Account Sagas', () => {
  test('accountSaga', () => {
    testSaga(accountSaga)
      .next()
      .fork(fetchingOnAccountPage)
      .next()
      .fork(refreshAccountOnTransaction)
      .next()
      .fork(refreshAccountOnParaTimeTransaction)
      .next()
      .takeLatest(accountActions.fetchAccount, fetchAccount)
      .next()
      .isDone()
  })

  it('Should refresh account on paraTime transaction', () => {
    return expectSaga(accountSaga)
      .withState(state)
      .provide([
        [matchers.call.fn(delayP), null], // https://github.com/jfairbank/redux-saga-test-plan/issues/257
      ])
      .dispatch(transactionActions.paraTimeTransactionSent('dummyAddress'))
      .put.actionType(accountActions.fetchAccount.type)
      .put.actionType(stakingActions.fetchAccount.type)
      .silentRun(50)
  })

  it('should update account and wallet balances', () => {
    return (
      expectSaga(accountSaga)
        .withState(state)
        .provide([
          [matchers.call.fn(getExplorerAPIs), {}],
          [matchers.call.fn(getAccountBalanceWithFallback), {}],
        ])
        .dispatch(accountActions.fetchAccount('dummyAddress'))
        // we have two sources of truth for balances for a selected account
        .put.actionType(accountActions.accountLoaded.type)
        .put.actionType(walletActions.updateBalance.type)
        .silentRun(50)
    )
  })
})
