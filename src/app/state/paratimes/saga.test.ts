import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'

import { paraTimesActions } from '.'
import { getOasisNic } from '../network/saga'
import { getRuntimeBalance, fetchBalanceUsingOasisAddress, fetchBalanceUsingEthPrivateKey } from './saga'
import { ParaTime } from '../../../config'

jest.mock('app/lib/eth-helpers')

describe('ParaTimes Sagas', () => {
  const providers: (EffectProviders | StaticProvider)[] = [
    [matchers.call.fn(getOasisNic), {}],
    [matchers.call.fn(getRuntimeBalance), 10000000000n],
  ]

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('fetchBalanceUsingOasisAddress', () => {
    it('should fetch ParaTime balance', () => {
      return expectSaga(
        fetchBalanceUsingOasisAddress,
        paraTimesActions.fetchBalanceUsingOasisAddress({
          address: 'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
          paraTime: ParaTime.Cipher,
        }),
      )
        .withState({})
        .provide(providers)
        .put({ type: paraTimesActions.balanceLoaded.type, payload: '10000000000' })
        .run()
    })
  })

  describe('fetchBalanceUsingEthPrivateKey', () => {
    it('should fetch ParaTime balance using ETH private key', () => {
      return expectSaga(
        fetchBalanceUsingEthPrivateKey,
        paraTimesActions.fetchBalanceUsingEthPrivateKey({
          privateKey: 'fakePrivateKey',
          paraTime: ParaTime.Emerald,
        }),
      )
        .withState({})
        .provide(providers)
        .put({ type: paraTimesActions.balanceLoaded.type, payload: '10000000000' })
        .run()
    })
  })
})
