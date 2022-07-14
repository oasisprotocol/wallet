import { OperationsRowTypeEnum, ValidatorRowStatusEnum } from 'vendors/explorer/index'
import {
  parseValidatorsList,
  parseAccount,
  parseTransactionsList,
  parseDelegations,
  parseDebonding,
} from '../monitor'

describe('monitor', () => {
  test('parse account', () => {
    expect(
      // https://monitor.oasis.dev/data/accounts/oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe
      parseAccount({
        address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
        liquid_balance: 756455428396,
        /* eslint-disable @typescript-eslint/no-loss-of-precision */
        escrow_balance: 336982978187110627,
        escrow_debonding_balance: 11942413553858170,
        delegations_balance: 1460535533308247,
        debonding_delegations_balance: 0,
        self_delegation_balance: 1460535533308247,
        total_balance: 336983734642539023,
        created_at: '2021-04-28T16:00:00Z',
        last_active: '2022-02-23T00:32:19Z',
        nonce: 2,
        type: 'validator',
        entity_address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
        validator: {
          rate_change_interval: 1,
          rate_bound_lead: 14,
          max_rate_steps: 21,
          max_bound_steps: 21,
          status: 'active',
          node_address: 'oasis1qrg52ccz4ts6cct2qu4retxn7kkdlusjh5pe74ar',
          consensus_address: '5E690F476067545CB5DD29BE90004EC7C691C8BF',
          depositors_count: 9690,
          blocks_count: 284137,
          signatures_count: 8387143,
        },
      }),
    ).toMatchSnapshot()
  })

  test('parse validators', () => {
    expect(
      // https://monitor.oasis.dev/data/validators?limit=2
      parseValidatorsList([
        {
          account_id: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
          account_name: 's',
          node_id: 'oasis1qrg52ccz4ts6cct2qu4retxn7kkdlusjh5pe74ar',
          escrow_balance: 336904789689084141,
          escrow_shares: 274886362332546983,
          general_balance: 756455426869,
          debonding_balance: 11945830584842735,
          delegations_balance: 336904789689080056,
          debonding_delegations_balance: 11945830584842735,
          self_delegation_balance: 1460299556746795,
          day_uptime: 1,
          total_uptime: 0.06541968901177232,
          validate_since: 1619625600,
          media_info: {
            website_link: 'https://s.f',
            email_address: 's@s.f',
            twitter_acc: 'https://twitter.com/s',
          },
          commission_schedule: {
            rates: [
              {
                rate: '5000',
              },
            ],
            bounds: [
              {
                rate_min: '0',
                rate_max: '20000',
              },
            ],
          },
          current_epoch: 12271,
          status: 'active' as ValidatorRowStatusEnum,
          depositors_count: 9682,
          blocks_count: 284050,
          signatures_count: 8385752,
        },
        {
          account_id: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
          account_name: 'b',
          node_id: 'oasis1qqp0h2h92eev7nsxgqctvuegt8ge3vyg0qyluc4k',
          escrow_balance: 326477290615842970,
          escrow_shares: 292714661665250275,
          general_balance: 37793606844709,
          debonding_balance: 2560860254985662,
          delegations_balance: 326477290615837694,
          debonding_delegations_balance: 2560860254985662,
          self_delegation_balance: 3599757097796153,
          day_uptime: 1,
          total_uptime: 0.1125559510498127,
          validate_since: 1619625600,
          media_info: {
            website_link: 'https://www.b.com',
          },
          commission_schedule: {
            rates: [
              {
                start: 4725,
                rate: '10000',
              },
            ],
            bounds: [
              {
                start: 4725,
                rate_min: '0',
                rate_max: '25000',
              },
            ],
          },
          current_epoch: 12271,
          status: 'inactive' as ValidatorRowStatusEnum,
          depositors_count: 12687,
          blocks_count: 488714,
          signatures_count: 8382100,
        },
        {
          account_id: 'oasis1qr0jwz65c29l044a204e3cllvumdg8cmsgt2k3ql',
          account_name: 'Staking Fund',
          node_id: 'oasis1qq93qrvrcfl8rpjm354h5yrjcredcvt7qclumsju',
          escrow_balance: 261889743044845473,
          escrow_shares: 216965001923624139,
          general_balance: 259655746770,
          debonding_balance: 41532330375304,
          delegations_balance: 261889743044844899,
          debonding_delegations_balance: 41532330375304,
          self_delegation_balance: 4047529223999696,
          day_uptime: 0,
          total_uptime: 0.09492514074287504,
          validate_since: 1619625600,
          media_info: {
            website_link: 'https://staking.fund',
            email_address: 'go@staking.fund',
            twitter_acc: 'https://twitter.com/StakingFund',
          },
          commission_schedule: {
            rates: [{ rate: '5000' }, { start: 82, rate: '15000' }],
            bounds: [
              { rate_min: '0', rate_max: '20000' },
              { start: 353, rate_min: '0', rate_max: '20000' },
              { start: 420, rate_min: '0', rate_max: '20000' },
            ],
          },
          current_epoch: 12796,
          status: 'active' as ValidatorRowStatusEnum,
          depositors_count: 2002,
          blocks_count: 442124,
          signatures_count: 8738373,
        },
      ]),
    ).toMatchSnapshot()
  })
  /* eslint-enable @typescript-eslint/no-loss-of-precision */

  test('parse transaction list', () => {
    expect(
      parseTransactionsList([
        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=transfer&account_id=oasis1qz086axf5hreqpehv5hlgmtw7sfem79gz55v68wp
        {
          amount: 116899998000,
          fee: 2000,
          from: 'oasis1qz086axf5hreqpehv5hlgmtw7sfem79gz55v68wp',
          gas_price: 10001,
          hash: 'b831c4b2aa3188058717250cba279795d907e581bb4d7d40d9dc358d37a56254',
          level: 7381105,
          nonce: 1,
          timestamp: 1645644903,
          to: 'oasis1qpm97z4c28juhdea220jtq2e3mz4gruyg54xktlm',
          type: 'transfer' as OperationsRowTypeEnum,
          status: true,
        },

        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=addescrow&account_id=oasis1qz0rx0h3v8fyukfrr0npldrrzvpdg4wj2qxvg0kj
        {
          amount: 0,
          escrow_amount: 500100000000,
          from: 'oasis1qz0rx0h3v8fyukfrr0npldrrzvpdg4wj2qxvg0kj',
          gas_price: 1271,
          hash: 'e67c4331aa79c85736c4d96cd7b1f3eaad80301bb8d5c181c67482e57ebf0565',
          level: 7381138,
          nonce: 6,
          timestamp: 1645645107,
          to: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
          type: 'addescrow' as OperationsRowTypeEnum,
          status: true,
        },

        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=reclaimescrow&account_id=oasis1qzah5wn48ekakmq5405qvcg4czp8hjvrcvcywvhp
        {
          amount: 0,
          reclaim_escrow_amount: 363940923824,
          from: 'oasis1qzah5wn48ekakmq5405qvcg4czp8hjvrcvcywvhp',
          gas_price: 1275,
          hash: '0558d39e2c5ebe187fc2802ab442faa548013b247b5de1fb1ef75862dad4fb23',
          level: 7380979,
          nonce: 3,
          timestamp: 1645644147,
          to: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
          type: 'reclaimescrow' as OperationsRowTypeEnum,
          status: true,
        },

        //https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=amendcommissionschedule&account_id=oasis1qzl58e7v7pk50h66s2tv3u9rzf87twp7pcv7hul6
        {
          amount: 0,
          fee: 2000,
          from: 'oasis1qzl58e7v7pk50h66s2tv3u9rzf87twp7pcv7hul6',
          gas_price: 2269,
          hash: 'ba8e25c66ae31fa0a0837a414359bc2318c6c849515ca3dc1ffa9eb0a1ab92b3',
          level: 7361579,
          nonce: 17,
          timestamp: 1645526644,
          to: 'oasis1qpg3hpf3vtuueyl8f8jzgsy8clqqw6qgxgurwfy5',
          type: 'amendcommissionschedule' as OperationsRowTypeEnum,
          status: true,
        },

        //https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=allow&account_id=oasis1qq3833fnmkqe94h0ca6w8qa84sq8pu92qsjmfayj
        {
          amount: 1714900000000,
          from: 'oasis1qq3833fnmkqe94h0ca6w8qa84sq8pu92qsjmfayj',
          gas_price: 1289,
          hash: '8894b8e9866f66efe291155646f1c09d69d7221449a8d9f758ad1d31f504df03',
          level: 7381163,
          nonce: 2,
          timestamp: 1645645260,
          to: 'oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte',
          type: 'allow' as OperationsRowTypeEnum,
          status: true,
        },

        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=executorcommit&account_id=oasis1qzr9p9fpjqekr8dev66wuaedcpq5n09hwvpkd4pg
        {
          amount: 0,
          from: 'oasis1qzr9p9fpjqekr8dev66wuaedcpq5n09hwvpkd4pg',
          gas_price: 11671,
          hash: 'd6298496fc19fd95fa1e2b245d1c33661b9ebd7ffb184280c363a31d13210c2a',
          level: 7381204,
          nonce: 96832,
          timestamp: 1645645506,
          to: 'oasis1qpg3hpf3vtuueyl8f8jzgsy8clqqw6qgxgurwfy5',
          type: 'executorcommit' as OperationsRowTypeEnum,
          status: true,
        },

        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=executorproposertimeout&account_id=oasis1qz6k3gky5d43h70xh2c5vk5fztmzmxmmhc6rh72x
        {
          amount: 0,
          from: 'oasis1qz6k3gky5d43h70xh2c5vk5fztmzmxmmhc6rh72x',
          gas_price: 5296,
          hash: '46583095fd80becc2683aacc67684170de8d6bc6eca5103d7ac543106d729a8f',
          level: 7381052,
          nonce: 111031,
          timestamp: 1645644585,
          to: 'oasis1qpg3hpf3vtuueyl8f8jzgsy8clqqw6qgxgurwfy5',
          type: 'executorproposertimeout' as OperationsRowTypeEnum,
          status: false,
          error: 'roothash: proposer timeout not allowed',
        },

        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=registerentity&account_id=oasis1qpdlqz373hcqvafadd3lxptj42x84sws35s02r4r
        {
          amount: 0,
          fee: 1000,
          from: 'oasis1qpdlqz373hcqvafadd3lxptj42x84sws35s02r4r',
          gas_price: 4000,
          hash: '5378750685efed957417abea41e7d96804264cb51d85dcee45494ef0ca2f31c7',
          level: 7368263,
          nonce: 7,
          timestamp: 1645567265,
          to: 'oasis1qpg3hpf3vtuueyl8f8jzgsy8clqqw6qgxgurwfy5',
          type: 'registerentity' as OperationsRowTypeEnum,
          status: true,
        },

        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=registernode&account_id=oasis1qzwl8jlxzwjgz2m6d3ns0vt9hzfp2h63qsxs76ys
        {
          amount: 0,
          from: 'oasis1qzwl8jlxzwjgz2m6d3ns0vt9hzfp2h63qsxs76ys',
          gas_price: 6786,
          hash: '86a303d9891bbefb0984b82dcc0a51ec190d383248b536dcb8bc9ca0404824f4',
          level: 7381231,
          nonce: 5542,
          timestamp: 1645645670,
          to: 'oasis1qpg3hpf3vtuueyl8f8jzgsy8clqqw6qgxgurwfy5',
          type: 'registernode' as OperationsRowTypeEnum,
          status: true,
        },

        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=registerruntime&account_id=oasis1qrvmxhcjpjvgel9dqfs6zrnza3hqjpa6ug2arc0d
        {
          amount: 0,
          from: 'oasis1qrvmxhcjpjvgel9dqfs6zrnza3hqjpa6ug2arc0d',
          gas_price: 3000,
          hash: '2ac0a88ab2c85cef69905c8c9b3f639c5b3b15b969c334df5dcc4fa54f183a8a',
          level: 6251849,
          nonce: 4,
          timestamp: 1638867315,
          to: 'oasis1qpg3hpf3vtuueyl8f8jzgsy8clqqw6qgxgurwfy5',
          type: 'registerruntime' as OperationsRowTypeEnum,
          status: true,
        },

        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=castvote&account_id=oasis1qp3rhyfjagkj65cnn6lt8ej305gh3kamsvzspluq
        {
          amount: 0,
          fee: 4000,
          from: 'oasis1qp3rhyfjagkj65cnn6lt8ej305gh3kamsvzspluq',
          gas_price: 4000,
          gas_used: 1,
          hash: 'a62ebc4d30bc045f129f33a14d4019ec88e48c150980ed388d5f64b6e9476059',
          level: 4726356,
          nonce: 5,
          timestamp: 1629793437,
          to: 'oasis1qpg3hpf3vtuueyl8f8jzgsy8clqqw6qgxgurwfy5',
          type: 'castvote' as OperationsRowTypeEnum,
          status: true,
        },
        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=pvsscommit&account_id=oasis1qrd64zucfaugv677fwkhynte4dz450yffgp0k06t
        {
          amount: 0,
          from: 'oasis1qrd64zucfaugv677fwkhynte4dz450yffgp0k06t',
          hash: 'f42c704c38ddbab62e83d787e9ff1097c703eac0bcf5587388dd208abae9b888',
          level: 7380719,
          nonce: 12295,
          timestamp: 1645642579,
          to: 'oasis1qpg3hpf3vtuueyl8f8jzgsy8clqqw6qgxgurwfy5',
          type: 'pvsscommit' as OperationsRowTypeEnum,
          status: true,
        },

        // https://monitor.oasis.dev/data/transactions?limit=200&operation_kind=pvssreveal&account_id=oasis1qptn9zmdn5ksvq85vxg2mg84e9m6jp2875dyfl73
        {
          amount: 0,
          from: 'oasis1qptn9zmdn5ksvq85vxg2mg84e9m6jp2875dyfl73',
          hash: '9c9fd0d2588a0108ec5f277f476483f17e2d8429e947c83f0096b0a7c351aa51',
          level: 7381114,
          nonce: 2406,
          timestamp: 1645644962,
          to: 'oasis1qpg3hpf3vtuueyl8f8jzgsy8clqqw6qgxgurwfy5',
          type: 'pvssreveal' as OperationsRowTypeEnum,
          status: true,
        },
      ]),
    ).toMatchSnapshot()
  })

  test('parse delegations', () => {
    const delegations = new Map([
      [
        new Uint8Array([
          0, 51, 102, 40, 155, 64, 182, 211, 201, 80, 87, 60, 135, 222, 248, 246, 125, 236, 234, 149, 179,
        ]),
        {
          pool: {
            balance: new Uint8Array([4, 131, 71, 26, 123, 91, 53, 58]),
            total_shares: new Uint8Array([4, 10, 245, 241, 35, 248, 110, 211]),
          },
          shares: new Uint8Array([1, 56, 206]),
        },
      ],
    ])
    const debondingDelegations = new Map([
      [
        new Uint8Array([
          0, 51, 102, 40, 155, 64, 182, 211, 201, 80, 87, 60, 135, 222, 248, 246, 125, 236, 234, 149, 179,
        ]),
        [
          {
            pool: {
              balance: new Uint8Array([17, 229, 254, 62, 101, 60, 93]),
              total_shares: new Uint8Array([17, 229, 254, 62, 101, 60, 93]),
            },
            shares: new Uint8Array([84, 188, 145, 201, 176]),
            debond_end: 12626,
          },
        ],
      ],
    ])

    expect({
      delegations: parseDelegations(delegations),
      debonding: parseDebonding(debondingDelegations),
    }).toMatchSnapshot()
  })

  test('parse delegations without losing precision', () => {
    const delegations = new Map([
      [
        new Uint8Array([
          0, 51, 102, 40, 155, 64, 182, 211, 201, 80, 87, 60, 135, 222, 248, 246, 125, 236, 234, 149, 179,
        ]),
        {
          pool: {
            balance: new Uint8Array([17, 229, 254, 62, 17, 229, 254, 62, 101, 60, 93]),
            total_shares: new Uint8Array([16, 229, 254, 62, 19, 229, 254, 62, 101, 60, 93]),
          },
          shares: new Uint8Array([84, 188, 145, 201, 84, 188, 145, 201, 176]),
        },
      ],
    ])
    expect(parseDelegations(delegations)[0]).toEqual({
      validatorAddress: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
      amount: '1655615038322038833148',
      shares: '1563114365108133939632',
    })
  })
})
