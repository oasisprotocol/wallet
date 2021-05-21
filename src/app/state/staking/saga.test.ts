import * as oasis from '@oasisprotocol/client'
import { StakingDebondingDelegationInfo, StakingDelegationInfo } from '@oasisprotocol/client/dist/types'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'
import { select } from 'redux-saga/effects'
import { ValidatorRow } from 'vendors/explorer'

import { initialState, stakingActions, stakingReducer } from '.'
import { getExplorerAPIs, getOasisNic } from '../network/saga'
import { selectEpoch } from '../network/selectors'
import { fetchAccount, stakingSaga } from './saga'
import { StakingState } from './types'

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
  const nic = {
    stakingAccount: jest.fn(),
    stakingDebondingDelegationInfosFor: jest.fn(),
    stakingDelegationInfosFor: jest.fn(),
  }

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

  describe('Validator details', () => {
    it('Should load the details regarding the selected validator', () => {
      nic.stakingAccount.mockResolvedValue({})

      return expectSaga(stakingSaga)
        .withState({})
        .provide(providers)
        .dispatch(stakingActions.validatorSelected('oasis1qqzz2le7nua2hvrkjrc9kc6n08ycs9a80chejmr7'))
        .put.actionType(stakingActions.updateValidatorDetails.type)
        .run()
    })

    it('Should keep and augment relevant bounds', async () => {
      nic.stakingAccount.mockResolvedValue({
        escrow: {
          commission_schedule: {
            bounds: [
              {
                rate_min: qty(1000),
                rate_max: qty(2000),
                start: 500,
              },
              {
                rate_min: qty(1000),
                rate_max: qty(2000),
                start: 200,
              },
              {
                rate_min: qty(1000),
                rate_max: qty(2000),
                start: 0,
              },
            ],
          },
        },
      })

      const result = await expectSaga(stakingSaga)
        .withState(initialState)
        .withReducer(stakingReducer)
        .provide([...providers, [select(selectEpoch), 300]])
        .dispatch(stakingActions.validatorSelected('oasis1qqzz2le7nua2hvrkjrc9kc6n08ycs9a80chejmr7'))
        .put.actionType(stakingActions.updateValidatorDetails.type)
        .run()

      const finalState: StakingState = result.storeState
      const bounds = finalState.selectedValidatorDetails!.scheduledCommissionBounds

      // The "older" 0-200 bounds should have been filtered out
      expect(bounds).toHaveLength(2)
      expect(bounds).toEqual([
        { epochEnd: 499, epochStart: 200, lower: 0.01, upper: 0.02 },
        { epochEnd: undefined, epochStart: 500, lower: 0.01, upper: 0.02 },
      ])
    })
  })
})
