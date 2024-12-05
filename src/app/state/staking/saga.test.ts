import * as oasis from '@oasisprotocol/client'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'
import { DeepPartialRootState } from 'types/RootState'
import { WalletError, WalletErrors } from 'types/errors'

import { initialState, stakingActions, stakingReducer } from '.'
import { getExplorerAPIs, getOasisNic } from '../network/saga'
import { selectEpoch } from '../network/selectors'
import {
  fetchAccount,
  getMainnetDumpValidators,
  getValidatorDetails,
  refreshValidators,
  now,
  stakingSaga,
} from './saga'
import { DebondingDelegation, Delegation, StakingState, Validator } from './types'
import { parseValidatorsList } from 'vendors/nexus'
import { Validator as NexusValidator } from 'vendors/nexus/models'

const qty = (number: number) => oasis.quantity.fromBigInt(BigInt(number))

describe('Staking Sagas', () => {
  const getAllValidators = jest.fn()
  const getDelegations = jest.fn()
  const nic = {
    stakingAccount: jest.fn(),
    stakingDebondingDelegationInfosFor: jest.fn(),
    stakingDelegationInfosFor: jest.fn(),
    schedulerGetValidators: jest.fn(),
  }

  const providers: (EffectProviders | StaticProvider)[] = [
    [matchers.call.fn(getExplorerAPIs), { getAllValidators, getDelegations }],
    [matchers.call.fn(getOasisNic), nic],
    [matchers.call.fn(now), new Date('2022').getTime()],
  ]
  const validAddress = 'oasis1qqty93azxp4qeft3krvv23ljyj57g3tzk56tqhqe'

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Fetch Account', () => {
    it('Should load the delegations and validators', () => {
      getAllValidators.mockResolvedValue([
        { address: 'oasis1qqzz2le7nua2hvrkjrc9kc6n08ycs9a80chejmr7', escrow: 1000n.toString() },
        { address: 'dummy', escrow: 2000n.toString() },
      ] as Validator[])

      getDelegations.mockResolvedValue({
        delegations: [{ validatorAddress: 'dummy', amount: 100n.toString(), shares: 100n.toString() }],
        debonding: [
          { validatorAddress: 'dummy', amount: 100n.toString(), shares: 100n.toString(), epoch: 1234 },
        ],
      } as {
        delegations: Delegation[]
        debonding: DebondingDelegation[]
      })

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
        .withState({
          network: {
            epoch: 35337,
          },
        })
        .provide(providers)
        .dispatch(stakingActions.validatorSelected('oasis1qqzz2le7nua2hvrkjrc9kc6n08ycs9a80chejmr7'))
        .put.actionType(stakingActions.updateValidatorDetails.type)
        .silentRun()
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
        .provide([...providers, [matchers.select.selector(selectEpoch), 300]])
        .dispatch(stakingActions.validatorSelected('oasis1qqzz2le7nua2hvrkjrc9kc6n08ycs9a80chejmr7'))
        .put.actionType(stakingActions.updateValidatorDetails.type)
        .silentRun()

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

  describe('Fetch validators fallbacks', () => {
    it('should load validators when switching network', () => {
      getAllValidators.mockResolvedValue([{ address: 'fromApi' }] as Validator[])
      return expectSaga(refreshValidators)
        .withState<DeepPartialRootState>({
          network: { selectedNetwork: 'testnet' },
          staking: { validators: { network: 'mainnet', list: [{ address: 'existing' }] } },
        })
        .provide(providers)
        .put(
          stakingActions.updateValidators({
            timestamp: new Date('2022').getTime(),
            network: 'testnet',
            list: [{ address: 'fromApi' }] as Validator[],
          }),
        )
        .run()
    })

    it('should use fallback on mainnet', () => {
      getAllValidators.mockRejectedValue(new WalletError(WalletErrors.IndexerAPIError, 'Request failed'))
      const getMainnetDumpValidatorsMock = {
        dump_timestamp: 1647996761337,
        dump_timestamp_iso: '2022-03-23T00:52:41.337Z',
        list: [
          {
            active: true,
            current_commission_bound: {
              epoch_end: 0,
              epoch_start: 0,
              lower: 0,
              upper: 20000,
            },
            current_rate: 5000,
            entity_address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
            entity_id: 'eZuacXy5s3/nolB/E3gF4vqUYdvfOlVaaBXGfZcGwKc=',
            escrow: {
              active_balance: '153866511910432557',
              active_shares: '109032182592723438',
              debonding_balance: '16650100374694405',
              debonding_shares: '16650100374694405',
              num_delegators: 7763,
              self_delegation_balance: '619388791323275',
              self_delegation_shares: '438908447022946',
            },
            in_validator_set: true,
            media: {
              name: 'stakefish',
            },
            node_id: 'SQZZd1wsWXdFsqswUoh6hZtmzu+ejuSnrGeHtgIBJDo=',
            rank: 2,
            start_date: '2024-04-11T03:43:47Z',
            voting_power: 9616629779339760,
            voting_power_cumulative: 19271157520617090,
            _expectedStatus: true,
          },
          {
            active: true,
            current_commission_bound: {
              epoch_end: 0,
              epoch_start: 4725,
              lower: 0,
              upper: 25000,
            },
            current_rate: 10000,
            entity_address: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
            entity_id: '9sAhd+Wi6tG5nAr3LwXD0y9mUKLYqfAbS2+7SZdNHB4=',
            escrow: {
              active_balance: '120770371034123739',
              active_shares: '94613417937776490',
              debonding_balance: '3799179743582808',
              debonding_shares: '3799179743582808',
              num_delegators: 7199,
              self_delegation_balance: '3484701686486584',
              self_delegation_shares: '2729970391155567',
            },
            in_validator_set: true,
            media: {
              name: 'BinanceStaking',
            },
            node_id: '6wbL5/OxvFGxi55o7AxcwKmfjXbXGC1hw4lfnEZxBXA=',
            rank: 5,
            start_date: '2021-04-28T16:00:00Z',
            voting_power: 7548126828433809,
            voting_power_cumulative: 43461945454389704,
            _expectedStatus: false,
          },
        ],
      }
      nic.schedulerGetValidators.mockResolvedValue([
        {
          // oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe
          entity_id: oasis.misc.fromHex('799b9a717cb9b37fe7a2507f137805e2fa9461dbdf3a555a6815c67d9706c0a7'),
          // oasis1qrg52ccz4ts6cct2qu4retxn7kkdlusjh5pe74ar
          id: oasis.misc.fromHex('91e7768ae47cd1641d6f883b97e3ea6d0286240bc3e3e2953c5c2e0dce6753a3'),
          voting_power: 1,
        },
      ] as oasis.types.SchedulerValidator[])
      jest
        .spyOn(console, 'error')
        .mockImplementationOnce(message => expect(message).toBe('get validators list failed'))

      return expectSaga(refreshValidators)
        .withState<DeepPartialRootState>({
          network: { selectedNetwork: 'mainnet' },
        })
        .provide([...providers, [matchers.call.fn(getMainnetDumpValidators), getMainnetDumpValidatorsMock]])
        .put(
          stakingActions.updateValidatorsError({
            error: {
              code: WalletErrors.IndexerAPIError,
              message: 'Request failed',
            },
            validators: {
              timestamp: getMainnetDumpValidatorsMock.dump_timestamp,
              network: 'mainnet',
              list: parseValidatorsList(
                getMainnetDumpValidatorsMock.list.map(({ _expectedStatus, ...v }) => ({
                  ...v,
                  active: _expectedStatus,
                })) as NexusValidator[],
              ),
            },
          }),
        )
        .run()
    })
  })

  test('stakingSaga', () => {
    testSaga(stakingSaga)
      .next()
      .takeLatest(stakingActions.fetchAccount, fetchAccount)
      .next()
      .takeLatest(stakingActions.validatorSelected, getValidatorDetails)
      .next()
      .isDone()
  })
})
