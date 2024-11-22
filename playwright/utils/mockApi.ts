import { BrowserContext, Page } from '@playwright/test'
import type {
  Account,
  ConsensusTxMethod,
  Delegation,
  Transaction,
  Validator,
} from '../../src/vendors/nexus/index'
import { StringifiedBigInt } from '../../src/types/StringifiedBigInt'

export async function mockApi(context: BrowserContext | Page, balance: StringifiedBigInt) {
  await context.addInitScript(() => ((window as any).REACT_APP_BACKEND = 'nexus'))
  await context.route('**/consensus/accounts/*', route => {
    route.fulfill({
      body: JSON.stringify({
        address: route.request().url().split('/consensus/accounts/')[1],
        available: balance.toString(),
        escrow: '0',
        debonding: '0',
        debonding_delegations_balance: '0',
        delegations_balance: '0',
        nonce: 1,
        allowances: [],
        stats: {
          num_txns: 1,
        },
      } satisfies Account),
    })
  })
  await context.route('**/consensus/accounts/*/delegations', route => {
    route.fulfill({
      body: JSON.stringify({ delegations: [], is_total_count_clipped: false, total_count: 0 }),
    })
  })
  await context.route('**/consensus/accounts/*/debonding_delegations', route => {
    route.fulfill({
      body: JSON.stringify({ debonding_delegations: [], is_total_count_clipped: false, total_count: 0 }),
    })
  })

  await context.route('**/consensus/transactions?*', route => {
    route.fulfill({
      body: JSON.stringify({
        is_total_count_clipped: false,
        total_count: 0,
        transactions: [],
      }),
    })
  })
  await context.route('**/sapphire/transactions?*', route => {
    route.fulfill({
      body: JSON.stringify({
        is_total_count_clipped: false,
        total_count: 0,
        transactions: [],
      }),
    })
  })
  await context.route('**/emerald/transactions?*', route => {
    route.fulfill({
      body: JSON.stringify({
        is_total_count_clipped: false,
        total_count: 0,
        transactions: [],
      }),
    })
  })
  await context.route('**/consensus/validators', route => {
    route.fulfill({
      body: JSON.stringify({
        is_total_count_clipped: false,
        stats: [],
        total_count: 0,
        validators: [],
      }),
    })
  })

  await context.route('**/oasis-core.Consensus/GetChainContext', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAEJ4QGIxMWIzNjllMGRhNWJiMjMwYjIyMDEyN2Y1ZTdiMjQyZDM4NWVmOGM2ZjU0OTA2MjQzZjMwYWY2M2M4MTU1MzU=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Beacon/GetEpoch', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAMZR8Q=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Staking/Account', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAGggAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Consensus/GetSignerNonce', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAIYKQ==gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Consensus/EstimateGas', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAMZBPE=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Consensus/SubmitTx', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAA=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })

  // Inside Transak iframe
  await context.route('https://sentry.io/**', route => route.fulfill({ body: '' }))
  await context.route('https://cdn.segment.com/**', route => route.fulfill({ body: '' }))
  await context.route('https://api.segment.io/**', route => route.fulfill({ body: '' }))
  await context.route('https://api.sardine.ai/**', route => route.fulfill({ body: '' }))
}

export async function mockApiMoreData(context: BrowserContext | Page) {
  await mockApi(context, '0')

  await context.route('**/consensus/accounts/*', route => {
    route.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          address: route.request().url().split('/consensus/accounts/')[1],
          available: '23239060788',
          escrow: '100996756163',
          debonding: '0',
          debonding_delegations_balance: '0',
          delegations_balance: '0',
          nonce: 70,
          allowances: [],
          stats: {
            num_txns: 1,
          },
        } satisfies Account,
      }),
    })
  })
  await context.route('**/consensus/accounts/*/delegations', route => {
    route.fulfill({
      body: JSON.stringify({
        is_total_count_clipped: false,
        total_count: 1,
        delegations: [
          {
            amount: '100826130447',
            delegator: 'oasis1qqnk4au603zs94k0d0n7c0hkx8t4p6r87s60axru',
            shares: '79562857663',
            validator: 'oasis1qp0xuvw2a93w4yp8jwthfz93gxy87u7hes9eu2ev',
          },
        ] satisfies Delegation[],
      }),
    })
  })
  await context.route('**/consensus/accounts/*/debonding_delegations', route => {
    route.fulfill({
      body: JSON.stringify({ debonding_delegations: [], is_total_count_clipped: false, total_count: 0 }),
    })
  })
  await context.route('**/consensus/transactions?*', route => {
    route.fulfill({
      body: JSON.stringify({
        is_total_count_clipped: false,
        total_count: 2,

        transactions: [
          {
            body: {
              account: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
              amount: '1994150103038',
            },
            hash: 'a2356cfe7231c832a3e25eca308de52a2d6fb56923845d0b9a1e810fed1a1a6c',
            block: 6919601,
            method: 'staking.AddEscrow' as ConsensusTxMethod,
            fee: '0',
            timestamp: '2024-11-21T08:11:30Z',
            success: true,
            sender: new URL(route.request().url()).searchParams.get('address')!,
          },
          {
            body: {
              amount: '119900000000',
              to: new URL(route.request().url()).searchParams.get('address')!,
            },
            hash: '9d5a9eb4e82633e7847989d3e84bce6a51b18434dea83e7f038091dbbb5c8bd5',
            height: 6919536,
            method: 'staking.Transfer' as ConsensusTxMethod,
            fee: '0',
            timestamp: '2024-11-22T00:19:34Z',
            success: true,
            sender: 'oasis1qprje45lh2qqrsy4rcvgx4zpnpzkhkqcm58emr3l',
          },
        ] satisfies Transaction[],
      }),
    })
  })
  await context.route('**/consensus/validators', route => {
    route.fulfill({
      body: JSON.stringify({
        is_total_count_clipped: false,
        stats: {
          total_delegators: 54745,
          total_staked_balance: '4001234121281725585',
          total_voting_power: '247946980677285944',
        },
        total_count: 281,
        validators: [
          {
            active: true,
            current_commission_bound: { epoch_end: 0, epoch_start: 0, lower: 0, upper: 20000 },
            current_rate: 5000,
            entity_address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
            entity_id: 'eZuacXy5s3/nolB/E3gF4vqUYdvfOlVaaBXGfZcGwKc=',
            escrow: {
              active_balance: '168026013465721765',
              active_shares: '119172147012596776',
              debonding_balance: '9467230407622552',
              debonding_shares: '9467230407622552',
              num_delegators: 8132,
              self_delegation_balance: '611241601978225',
              self_delegation_shares: '433522003817728',
            },
            in_validator_set: true,
            media: {
              email: 'hi@stake.fish',
              keybase: 'bflabs',
              logoUrl:
                'https://s3.amazonaws.com/keybase_processed_uploads/e1378cd4d5203ded716906687ad53905_360_360.jpg',
              name: 'stakefish',
              twitter: 'stakefish',
              url: 'https://stake.fish',
            },
            node_id: 'SQZZd1wsWXdFsqswUoh6hZtmzu+ejuSnrGeHtgIBJDo=',
            rank: 1,
            start_date: '2024-04-11T03:43:47Z',
            voting_power: 7773301654007068,
            voting_power_cumulative: 44859726036891190,
          },
          {
            active: true,
            current_commission_bound: { epoch_end: 0, epoch_start: 20603, lower: 0, upper: 100000 },
            current_rate: 8000,
            entity_address: 'oasis1qqtmpsavs44vz8868p008uwjulfq03pcjswslutz',
            entity_id: 'c+Kr/VTZLJes6N2u6nTEj7aWje8wHApJeVEoOdvhCh8=',
            escrow: {
              active_balance: '153272453164515049',
              active_shares: '144880479393976504',
              debonding_balance: '1313859153712116',
              debonding_shares: '1313859153712116',
              num_delegators: 80,
              self_delegation_balance: '169380993446265',
              self_delegation_shares: '160107044834618',
            },
            in_validator_set: true,
            media: {
              email: 'contact@kiln.fi',
              keybase: 'kilnfi',
              logoUrl:
                'https://s3.amazonaws.com/keybase_processed_uploads/e976400f2c6613037aa555dd11394305_360_360.jpg',
              name: 'Kiln',
              twitter: 'Kiln_finance',
              url: 'https://kiln.fi',
            },
            node_id: 'jKA6PqWwftnglxywnQQPoIcb7j2HQVu7anf2i7LWU2c=',
            rank: 2,
            start_date: '2023-02-01T08:00:21Z',
            voting_power: 7773301654007068,
            voting_power_cumulative: 44859726036891190,
          },
          {
            active: true,
            current_commission_bound: { epoch_end: 0, epoch_start: 0, lower: 0, upper: 20000 },
            current_rate: 5000,
            entity_address: 'oasis1qpn83e8hm3gdhvpfv66xj3qsetkj3ulmkugmmxn3',
            entity_id: '9D+kziTxFhg77+cyt+Fwd6eXREkZ1wHw7WX7VG57MeA=',
            escrow: {
              active_balance: '138101214710958403',
              active_shares: '97812436791488919',
              debonding_balance: '2515461941557498',
              debonding_shares: '2515461941557498',
              num_delegators: 2200,
              self_delegation_balance: '49749375336253',
              self_delegation_shares: '35235806148975',
            },
            in_validator_set: true,
            media: {
              email: 'techops@chorus.one',
              keybase: 'chorusoneinc',
              logoUrl:
                'https://s3.amazonaws.com/keybase_processed_uploads/3a844f583b686ec5285403694b738a05_360_360.jpg',
              name: 'Chorus One',
              twitter: 'ChorusOne',
              url: 'https://chorus.one/',
            },
            node_id: 'SCA1zoR15jpC2eugP1P/CZBQhMjHEtmJ7+hWemgTdWo=',
            rank: 3,
            start_date: '2021-04-28T16:00:00Z',
            voting_power: 7773301654007068,
            voting_power_cumulative: 44859726036891190,
          },
          {
            active: true,
            current_commission_bound: { epoch_end: 0, epoch_start: 0, lower: 0, upper: 20000 },
            current_rate: 10000,
            entity_address: 'oasis1qq7vyz4ewrdh00yujw0mgkf459et306xmvh2h3zg',
            entity_id: 'FDqRmM1FyhaGas+lquWmGAKgMsU2rj7UESAlnOHtxco=',
            escrow: {
              active_balance: '133984788058246819',
              active_shares: '96629756290216092',
              debonding_balance: '239575614066662',
              debonding_shares: '239575614066662',
              num_delegators: 204,
              self_delegation_balance: '7629981433882',
              self_delegation_shares: '5502738461133',
            },
            in_validator_set: true,
            media: {
              email: 'p.pavlov@p2p.org',
              keybase: 'p2p_org_',
              logoUrl:
                'https://s3.amazonaws.com/keybase_processed_uploads/0e54d989cbe0b1eed716e222bf2cdd05_360_360.jpg',
              name: 'P2P.ORG - P2P Validator',
              twitter: 'P2Pvalidator',
              url: 'https://p2p.org/',
            },
            node_id: '5UbIi8RQj4flFn9N8wHjQqp6QwZFJi2QdD2mOYLa/sY=',
            rank: 4,
            start_date: '2021-04-28T16:00:00Z',
            voting_power: 7773301654007068,
            voting_power_cumulative: 44859726036891190,
          },
          {
            active: true,
            current_commission_bound: { epoch_end: 0, epoch_start: 4725, lower: 0, upper: 25000 },
            current_rate: 10000,
            entity_address: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
            entity_id: '9sAhd+Wi6tG5nAr3LwXD0y9mUKLYqfAbS2+7SZdNHB4=',
            escrow: {
              active_balance: '124373178439211987',
              active_shares: '97518341155226051',
              debonding_balance: '2283701605519128',
              debonding_shares: '2283701605519128',
              num_delegators: 7506,
              self_delegation_balance: '3470218233061100',
              self_delegation_shares: '2720923673267204',
            },
            in_validator_set: true,
            media: { name: 'BinanceStaking', url: 'https://www.binance.com' },
            node_id: '6wbL5/OxvFGxi55o7AxcwKmfjXbXGC1hw4lfnEZxBXA=',
            rank: 5,
            start_date: '2021-04-28T16:00:00Z',
            voting_power: 7773301654007068,
            voting_power_cumulative: 44859726036891190,
          },
        ] satisfies Validator[],
      }),
    })
  })
}
