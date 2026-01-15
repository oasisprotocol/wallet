import { BrowserContext, Page } from '@playwright/test'
import type {
  Account,
  ConsensusTxMethod,
  Delegation,
  Transaction,
  Validator,
} from '../../src/vendors/nexus/index'
import { StringifiedBigInt } from '../../src/types/StringifiedBigInt'

export async function mockApi(context: BrowserContext | Page, balance: number | StringifiedBigInt) {
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
  await context.route('**/consensus/validators?*', route => {
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
}

export async function mockApiMoreData(context: BrowserContext | Page) {
  await mockApi(context, '0')

  await context.route('**/consensus/accounts/*', route => {
    route.fulfill({
      body: JSON.stringify({
        address: route.request().url().split('/consensus/accounts/')[1],
        available: '23239060788',
        escrow: '0',
        debonding: '0',
        debonding_delegations_balance: '0',
        delegations_balance: '100996756163',
        nonce: 70,
        allowances: [],
        stats: {
          num_txns: 1,
        },
      } satisfies Account),
    })
  })
  await context.route('**/consensus/accounts/*/delegations', route => {
    route.fulfill({
      body: JSON.stringify({
        is_total_count_clipped: false,
        total_count: 1,
        delegations: [
          {
            amount: '100996756163',
            delegator: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
            shares: '71939343766',
            validator: 'oasis1qrdx0n7lgheek24t24vejdks9uqmfldtmgdv7jzz',
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
  await context.route('**/consensus/validators?*', route => {
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
            current_commission_bound: { epoch_end: 0, epoch_start: 4725, lower: 0, upper: 25000 },
            current_rate: 10000,
            entity_address: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
            entity_id: '9sAhd+Wi6tG5nAr3LwXD0y9mUKLYqfAbS2+7SZdNHB4=',
            escrow: {
              active_balance: '199664752312527630',
              active_balance_24: '199662460590566423',
              active_shares: '152506615138941481',
              debonding_balance: '33208359006744',
              debonding_shares: '33208359006744',
              num_delegators: 6288,
              self_delegation_balance: '4074564278850079',
              self_delegation_shares: '3112206832384802',
            },
            in_validator_set: true,
            media: { name: 'BinanceStaking', url: 'https://www.binance.com' },
            node_id: '6wbL5/OxvFGxi55o7AxcwKmfjXbXGC1hw4lfnEZxBXA=',
            rank: 1,
            start_date: '2021-04-28T16:00:00Z',
            uptime: {
              segment_length: 1200,
              segment_uptimes: [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200],
              window_length: 14400,
              window_uptime: 14400,
            },
            voting_power: 7773301654007068,
            voting_power_cumulative: 44859726036891190,
          },
          {
            active: true,
            current_commission_bound: { epoch_end: 0, epoch_start: 0, lower: 0, upper: 0 },
            current_rate: 0,
            entity_address: 'oasis1qq0xmq7r0z9sdv02t5j9zs7en3n6574gtg8v9fyt',
            entity_id: 'zAhtGrpk1L3bBLaP5enm3natUTCoj7MEFryq9+MG4tE=',
            escrow: {
              active_balance: '114149698824796228',
              active_balance_24: '113832441344093712',
              active_shares: '80421401334935920',
              debonding_balance: '3878929644611407',
              debonding_shares: '3878929644611407',
              num_delegators: 22237,
              self_delegation_balance: '20741681394761',
              self_delegation_shares: '14613048487931',
            },
            in_validator_set: true,
            media: {
              email: 'marssuper@outlook.com',
              keybase: 'marssuper',
              logoUrl:
                'https://s3.amazonaws.com/keybase_processed_uploads/f30f9b2207b7d83ef05219ca483b6f05_360_360.jpg',
              name: 'Mars Staking | Long term fee 1%',
              url: 'https://linktr.ee/marssuper',
            },
            node_id: 'PsfFUQrXqGoFtowWZcoc8ilh8xHP94LvNYHvqQHpw1E=',
            rank: 2,
            start_date: '2021-04-28T16:00:00Z',
            uptime: {
              segment_length: 1200,
              segment_uptimes: [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200],
              window_length: 14400,
              window_uptime: 14400,
            },
            voting_power: 7773301654007068,
            voting_power_cumulative: 44859726036891190,
          },
          {
            active: true,
            current_commission_bound: { epoch_end: 0, epoch_start: 0, lower: 0, upper: 20000 },
            current_rate: 20000,
            entity_address: 'oasis1qrdx0n7lgheek24t24vejdks9uqmfldtmgdv7jzz',
            entity_id: 'UkwjS1YvEfHx9b6MMT5Q1WvCY3aWn2lxRDsB/Pw+zGk=',
            escrow: {
              active_balance: '70952386884820937',
              active_balance_24: '70890997129270201',
              active_shares: '51727191330830166',
              debonding_balance: '0',
              debonding_shares: '0',
              num_delegators: 294,
              self_delegation_balance: '173241944386406',
              self_delegation_shares: '126300461439695',
            },
            in_validator_set: true,
            media: {
              email: 'hi@bitcat365.com',
              keybase: 'bitcat365',
              logoUrl:
                'https://s3.amazonaws.com/keybase_processed_uploads/e9b275afb8b9c413f797b4ac312c8e05_360_360.jpg',
              name: 'Bit Cat🐱',
              twitter: 'bitcat365',
              url: 'https://www.bitcat365.com',
            },
            node_id: '4bv9f6NqLf4+6+QII+p48KgpagFXk9PgIdefbuo2spA=',
            rank: 3,
            start_date: '2021-04-28T16:00:00Z',
            uptime: {
              segment_length: 1200,
              segment_uptimes: [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200],
              window_length: 14400,
              window_uptime: 14400,
            },
            voting_power: 7773301654007068,
            voting_power_cumulative: 44859726036891190,
          },
          {
            active: true,
            current_commission_bound: { epoch_end: 0, epoch_start: 0, lower: 0, upper: 20000 },
            current_rate: 15000,
            entity_address: 'oasis1qz0ea28d8p4xk8xztems60wq22f9pm2yyyd82tmt',
            entity_id: 'WazI78lMcmjyCH5+5RKkkfOTUR+XheHIohlqMu+a9As=',
            escrow: {
              active_balance: '67065104971333352',
              active_balance_24: '67060550070535076',
              active_shares: '47282535309647257',
              debonding_balance: '4750843938046802',
              debonding_shares: '4750843938046802',
              num_delegators: 467,
              self_delegation_balance: '62359733940962',
              self_delegation_shares: '43965133928055',
            },
            in_validator_set: true,
            media: {
              email: 'staking@simply-vc.com.mt',
              keybase: 'simplyvc',
              logoUrl:
                'https://s3.amazonaws.com/keybase_processed_uploads/27d4669503119b84bbc4bd4ae7f0bf05_360_360.jpg',
              name: 'Simply Staking',
              twitter: 'Simply_VC',
              url: 'https://simply-vc.com.mt/',
            },
            node_id: 'xHvUU4I+dQ4oKvlfe4IXoKi8OT8vdAgfszQ5ciPL6HI=',
            rank: 4,
            start_date: '2021-04-28T16:00:00Z',
            uptime: {
              segment_length: 1200,
              segment_uptimes: [1199, 1200, 1199, 1199, 1195, 1200, 1198, 1200, 1197, 1200, 1196, 1199],
              window_length: 14400,
              window_uptime: 14382,
            },
            voting_power: 7773301654007068,
            voting_power_cumulative: 44859726036891190,
          },
          {
            active: true,
            current_commission_bound: { epoch_end: 0, epoch_start: 9366, lower: 0, upper: 20000 },
            current_rate: 20000,
            entity_address: 'oasis1qp53ud2pcmm73mlf4qywnrr245222mvlz5a2e5ty',
            entity_id: 'N+3/m12DoAqzFS0yF3R/kXSkSj7pZnWhq8nRCo/MKwk=',
            escrow: {
              active_balance: '63993377180053855',
              active_balance_24: '63989030903626995',
              active_shares: '52739220015917455',
              debonding_balance: '0',
              debonding_shares: '0',
              num_delegators: 28,
              self_delegation_balance: '1986080356402572',
              self_delegation_shares: '1636799517407793',
            },
            in_validator_set: true,
            media: {
              keybase: 'crazysergo',
              logoUrl:
                'https://s3.amazonaws.com/keybase_processed_uploads/cd8f93d411033d0d08f463906f245405_360_360.jpg',
              name: 'SerGo',
              twitter: 'SGolovatenko',
              url: 'https://sergo.top/',
            },
            node_id: '6drUHh4qocfbBsA12qM8pTerEcbqhdaHt+v33sEr5kk=',
            rank: 5,
            start_date: '2021-08-16T17:39:50Z',
            uptime: {
              segment_length: 1200,
              segment_uptimes: [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200],
              window_length: 14400,
              window_uptime: 14400,
            },
            voting_power: 7773301654007068,
            voting_power_cumulative: 44859726036891190,
          },
        ] satisfies Validator[],
      }),
    })
  })
}
