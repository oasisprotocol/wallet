import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { stakingActions } from 'app/state/staking'
import { transactionActions } from 'app/state/transaction'
import { accountActions } from '.'
import {
  accountSaga,
  fetchAccount,
  refreshAccountOnTransaction,
  refreshAccountOnParaTimeTransaction,
} from './saga'
import { DeepPartialRootState } from 'types/RootState'

describe('Account Sagas', () => {
  test('accountSaga', () => {
    testSaga(accountSaga)
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
    return expectSaga(accountSaga)
      .withState(state)
      .dispatch(transactionActions.paraTimeTransactionSent('dummyAddress'))
      .put.actionType(accountActions.fetchAccount.type)
      .put.actionType(stakingActions.fetchAccount.type)
      .silentRun(50)
  })
})
