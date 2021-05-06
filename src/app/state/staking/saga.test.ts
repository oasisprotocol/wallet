import * as oasis from '@oasisprotocol/client'
import { StakingDebondingDelegationInfo, StakingDelegationInfo } from '@oasisprotocol/client/dist/types'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'
import { ValidatorRow } from 'vendors/explorer'

import { stakingActions } from '.'
import { getExplorerAPIs, getOasisNic } from '../network/saga'
import { fetchAccount } from './saga'

const qty = (number: number) => oasis.quantity.fromBigInt(BigInt(number))
const fixtureDebondingDelegation = new Map<Uint8Array, StakingDebondingDelegationInfo[]>([
  [
    new Uint8Array(),
    [{ debond_end: 1234, pool: { balance: qty(1000), total_shares: qty(1000) }, shares: qty(100) }],
  ],
])

const fixtureDelegation = new Map<Uint8Array, StakingDelegationInfo>([
  [new Uint8Array(), { pool: { balance: qty(1000), total_shares: qty(1000) }, shares: qty(100) }],
])

describe('Staking Sagas', () => {
  const accounts = { getValidatorsList: jest.fn() }
  const nic = { stakingDebondingDelegationInfosFor: jest.fn(), stakingDelegationInfosFor: jest.fn() }

  const providers: (EffectProviders | StaticProvider)[] = [
    [matchers.call.fn(getExplorerAPIs), { accounts }],
    [matchers.call.fn(getOasisNic), nic],
  ]
  const validAddress = 'oasis1qqty93azxp4qeft3krvv23ljyj57g3tzk56tqhqe'

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Fetch Account', () => {
    it('Should load the delegations and validators', () => {
      accounts.getValidatorsList.mockResolvedValue([
        { account_id: 'oasis1qqzz2le7nua2hvrkjrc9kc6n08ycs9a80chejmr7', escrow_balance: 1000 },
        { account_id: 'dummy', escrow_balance: 2000 },
      ] as ValidatorRow[])

      nic.stakingDelegationInfosFor.mockResolvedValue(fixtureDelegation)
      nic.stakingDebondingDelegationInfosFor.mockResolvedValue(fixtureDebondingDelegation)

      return (
        expectSaga(fetchAccount, stakingActions.fetchAccount(validAddress))
          .withState({})
          .provide(providers)
          .put.actionType(stakingActions.updateValidators.type)
          //@TODO check that we're loading everything in state
          .run()
      )
    })
  })
})
