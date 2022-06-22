import { testSaga } from 'redux-saga-test-plan'
import { networkActions } from '.'
import { networkSaga, selectNetwork } from './saga'

describe('Network Sagas', () => {
  const env = process.env

  afterEach(() => {
    process.env = { ...env }
  })

  test('networkSaga', () => {
    delete process.env.REACT_APP_LOCALNET

    testSaga(networkSaga)
      .next()
      .takeLatest(networkActions.selectNetwork, selectNetwork)
      .next()
      .put(networkActions.selectNetwork('mainnet'))
      .next()
      .isDone()
  })
})
