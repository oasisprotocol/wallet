import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { accountActions } from '.'
import { accountSaga, fetchAccount, refreshAccountOnTransaction } from './saga'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'
import { getExplorerAPIs, getOasisNic } from '../network/saga'

describe('Account Sagas', () => {
  test('accountSaga', () => {
    testSaga(accountSaga)
      .next()
      .fork(refreshAccountOnTransaction)
      .next()
      .takeLatest(accountActions.fetchAccount, fetchAccount)
      .next()
      .isDone()
  })
})

describe('Fetch Account', () => {
  const getAccount = jest.fn()
  const getTransactionsList = jest.fn()

  const providers: (EffectProviders | StaticProvider)[] = [
    [matchers.call.fn(getExplorerAPIs), { getAccount, getTransactionsList }],
    [matchers.call.fn(getOasisNic), {}],
  ]
  const validAddress = 'oasis1qqty93azxp4qeft3krvv23ljyj57g3tzk56tqhqe'

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Should load the account', () => {
    getAccount.mockResolvedValue([
      { address: 'oasis1qqzz2le7nua2hvrkjrc9kc6n08ycs9a80chejmr7', liquid_balance: 1000 },
    ])
    getTransactionsList.mockResolvedValue([])

    return expectSaga(fetchAccount, accountActions.fetchAccount(validAddress))
      .withState({})
      .provide(providers)
      .put.actionType(accountActions.accountLoaded.type)
      .run()
  })
})
