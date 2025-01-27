import { RuntimeTransactionEvmTx } from 'vendors/oasisscan-v2/index'
import {
  parseValidatorsList,
  parseAccount,
  parseTransactionsList,
  parseDelegations,
  parseDebonding,
} from '../oasisscan-v2'

describe('oasisscan-v2', () => {
  test('parse account', () => {
    expect(
      // https://api.oasisscan.com/v2/mainnet/account/info/oasis1qp53ud2pcmm73mlf4qywnrr245222mvlz5a2e5ty
      parseAccount({
        address: 'oasis1qp53ud2pcmm73mlf4qywnrr245222mvlz5a2e5ty',
        available: '79081.079928346',
        escrow: '1582807.331065921',
        debonding: '0.000000000',
        total: '1661888.410994267',
        nonce: 103,
        allowances: [
          {
            address: 'oasis1qrnu9yhwzap7rqh6tdcdcpz0zf86hwhycchkhvt8',
            amount: '1.000000000',
          },
        ],
      }),
    ).toMatchSnapshot()
  })

  test('parse validators', () => {
    expect(
      // https://api.oasisscan.com/v2/mainnet/validator/list?orderBy=escrow&sort=desc
      parseValidatorsList([
        {
          rank: 1,
          entityId: 'c+Kr/VTZLJes6N2u6nTEj7aWje8wHApJeVEoOdvhCh8=',
          entityAddress: 'oasis1qqtmpsavs44vz8868p008uwjulfq03pcjswslutz',
          nodeId: 'jKA6PqWwftnglxywnQQPoIcb7j2HQVu7anf2i7LWU2c=',
          nodeAddress: 'oasis1qq5c20yqk5cfey43m49h8slqrmm42zd9qg352f53',
          name: 'Kiln',
          icon: 'https://s3.amazonaws.com/keybase_processed_uploads/e976400f2c6613037aa555dd11394305_360_360.jpg',
          website: 'https://kiln.fi',
          twitter: 'Kiln_finance',
          keybase: 'kilnfi',
          email: 'contact@kiln.fi',
          description: '',
          escrow: '155132526.860793429',
          escrowChange24: '27611.011868783',
          escrowPercent: 0.0415,
          balance: '134.969905466',
          totalShares: '146130668.973273085',
          signs: 6011288,
          proposals: 134278,
          nonce: 0,
          score: 6279844,
          delegators: 93,
          uptime: '100%',
          active: true,
          commission: 0.08,
          rates: [],
          bounds: [],
          status: true,
        },
        {
          rank: 2,
          entityId: 'eZuacXy5s3/nolB/E3gF4vqUYdvfOlVaaBXGfZcGwKc=',
          entityAddress: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
          nodeId: 'SQZZd1wsWXdFsqswUoh6hZtmzu+ejuSnrGeHtgIBJDo=',
          nodeAddress: 'oasis1qphhk4g0ncqut2ds40mr932s5p8tkqcu3yaae227',
          name: 'stakefish',
          icon: 'https://s3.amazonaws.com/keybase_processed_uploads/e1378cd4d5203ded716906687ad53905_360_360.jpg',
          website: 'https://stake.fish',
          twitter: 'stakefish',
          keybase: 'bflabs',
          email: 'hi@stake.fish',
          description: '',
          escrow: '141543315.349195787',
          escrowChange24: '-330684.935705216',
          escrowPercent: 0.0379,
          balance: '5.654649463',
          totalShares: '100030213.159450010',
          signs: 5799731,
          proposals: 308760,
          nonce: 0,
          score: 6417251,
          delegators: 7418,
          uptime: '100%',
          active: true,
          commission: 0.05,
          rates: [],
          bounds: [],
          status: true,
        },
        {
          rank: 3,
          entityId: '9D+kziTxFhg77+cyt+Fwd6eXREkZ1wHw7WX7VG57MeA=',
          entityAddress: 'oasis1qpn83e8hm3gdhvpfv66xj3qsetkj3ulmkugmmxn3',
          nodeId: 'SCA1zoR15jpC2eugP1P/CZBQhMjHEtmJ7+hWemgTdWo=',
          nodeAddress: 'oasis1qrs74qakgmxcrj4vcvl6javrps65awk6x5656msr',
          name: 'Chorus One',
          icon: 'https://s3.amazonaws.com/keybase_processed_uploads/3a844f583b686ec5285403694b738a05_360_360.jpg',
          website: 'https://chorus.one/',
          twitter: 'ChorusOne',
          keybase: 'chorusoneinc',
          email: 'techops@chorus.one',
          description: '',
          escrow: '123770022.870837688',
          escrowChange24: '-70684.676970556',
          escrowPercent: 0.0331,
          balance: '58894.400940206',
          totalShares: '87351348.899352437',
          signs: 6012233,
          proposals: 236250,
          nonce: 0,
          score: 6484733,
          delegators: 1999,
          uptime: '100%',
          active: true,
          commission: 0.08,
          rates: [],
          bounds: [],
          status: true,
        },
      ]),
    ).toMatchSnapshot()
  })

  test('parse transaction list', () => {
    expect(
      parseTransactionsList([
        // Emerald ParaTime Object
        // https://api.oasisscan.com/v2/mainnet/runtime/transaction/info?id=000000000000000000000000000000000000000000000000e2eaa99fc008f87f&round=12638138&hash=00c71fa97422eafe9f030720a3c57e52b24bca0c81cb161ea8a9e39e190628ac
        {
          runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
          runtimeName: 'Emerald',
          txHash: '00c71fa97422eafe9f030720a3c57e52b24bca0c81cb161ea8a9e39e190628ac',
          round: 12638138,
          result: true,
          message: '',
          timestamp: 1729693571,
          type: 'consensus',
          ctx: {
            method: 'consensus.Deposit',
            from: 'oasis1qqnk4au603zs94k0d0n7c0hkx8t4p6r87s60axru',
            to: 'oasis1qra2sljuf780qutea635w933r8pu6lesysxp6xw9',
            amount: '44',
            nonce: 78,
          },
          etx: null as unknown as RuntimeTransactionEvmTx, // Missing in the response
          events: [
            [
              {
                GasUsed: {
                  amount: 61294,
                },
              },
            ],
          ],
        },

        // https://api.oasisscan.com/v2/mainnet/chain/transactions?method=staking.Transfer&runtime=false&page=1&size=1
        {
          txType: 'consensus',
          txHash: '6cfbdac302bcf93d7f0204a04c5f8780719501fe238ab6b161b5ce7f6ebdbe92',
          height: 22831816,
          method: 'staking.Transfer',
          fee: '0.000000000',
          amount: '0.100000000',
          shares: '0.000000000',
          add: true,
          timestamp: 1736930331,
          time: 11,
          status: true,
          from: 'oasis1qzyw98s2qrvf3t78nf0guu98laykw6lzkga5zlzy',
          to: 'oasis1qzca4c3gch3ymy3w7e5ffzf9l6alpazpf5ffyytn',
        },

        // https://api.oasisscan.com/v2/mainnet/chain/transactions?method=staking.AddEscrow&runtime=false&page=1&size=1
        {
          txType: 'consensus',
          txHash: '667bd1bbfe6d217b906521d17f2d59d49f7daa33fc3b6c3292b59fe45c09fea6',
          height: 22831554,
          method: 'staking.AddEscrow',
          fee: '0.000000000',
          amount: '25000.900000000',
          shares: '19536.228284261',
          add: true,
          timestamp: 1736928792,
          time: 1591,
          status: true,
          from: 'oasis1qquj8fnczvzcvx8q560ym7js37lnz3wnjvtx5xvt',
          to: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
        },

        // https://api.oasisscan.com/v2/mainnet/chain/transactions?method=staking.ReclaimEscrow&runtime=false&page=1&size=1
        {
          txType: 'consensus',
          txHash: '14fd88b9a54c9f1023ba19e659738030a35d9776d49fb1109e36d79df16563d7',
          height: 22826519,
          method: 'staking.ReclaimEscrow',
          fee: '0.000002000',
          amount: '238.686295585',
          shares: '181.000000000',
          timestamp: 1736899208,
          time: 31204,
          status: true,
          from: 'oasis1qqs5wnxvsk009swtt7ehm5fslxve96kczszwt47s',
          to: 'oasis1qqs5wnxvsk009swtt7ehm5fslxve96kczszwt47s',
        },

        // https://api.oasisscan.com/v2/mainnet/chain/transactions?method=staking.AmendCommissionSchedule&runtime=false&page=1&size=1
        {
          txType: 'consensus',
          txHash: 'd468509acce7853226ac5a8552ea98b90b1231a08bd357d10bf95ffa50a12a89',
          height: 22737133,
          method: 'staking.AmendCommissionSchedule',
          fee: '0.000002000',
          amount: '0.000000000',
          shares: '0.000000000',
          add: true,
          timestamp: 1736372956,
          time: 557474,
          status: true,
          from: 'oasis1qrc8s2trrm9zgha8wq636yetx7sxjf7x35pf3vrc',
        },

        // https://api.oasisscan.com/v2/mainnet/chain/transactions?method=staking.Allow&runtime=false&page=1&size=1
        {
          txType: 'consensus',
          txHash: '4bed95352d63dff872ab87beaac84b9556b1848b4ae46d5ee17f7da3fc89edba',
          height: 22825769,
          method: 'staking.Allow',
          fee: '0.000000000',
          amount: '49.900000000',
          shares: '0.000000000',
          add: true,
          timestamp: 1736894808,
          time: 35688,
          status: true,
          from: 'oasis1qqn0zqq0aw98dh50cqc5dfj4spam8cdddsqv4j6j',
          to: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
        },

        // https://api.oasisscan.com/v2/mainnet/chain/transactions?method=roothash.ExecutorCommit&runtime=false&page=1&size=1
        {
          txType: 'consensus',
          txHash: 'da4566971b81ef8ae655b20ef4abaf5eee228574debdff36e57580d9fa885f50',
          height: 22831864,
          method: 'roothash.ExecutorCommit',
          fee: '0.000000000',
          amount: '0.000000000',
          shares: '0.000000000',
          add: true,
          timestamp: 1736930611,
          time: 10,
          status: true,
          from: 'oasis1qqwmgc8a3aznsq32tc2zq3z5erc7cnzcpcmvluqv',
        },

        // https://api.oasisscan.com/v2/mainnet/chain/transactions?method=registry.RegisterEntity&runtime=false&page=1&size=1
        {
          txType: 'consensus',
          txHash: '360011badfab81ba0532deaf67610d43a878d956e98c125e13a1a213c88be59e',
          height: 22730556,
          method: 'registry.RegisterEntity',
          fee: '0.000000000',
          amount: '0.000000000',
          shares: '0.000000000',
          add: true,
          timestamp: 1736334075,
          time: 596608,
          from: 'oasis1qz5afnujgfsxhct630f8nlqtpgxd5kzlvuvtnfqr',
        },

        // https://api.oasisscan.com/v2/mainnet/chain/transactions?method=registry.RegisterNode&runtime=false&page=1&size=1
        {
          txType: 'consensus',
          txHash: '996c6b02ee289d25a8aaca952b7e6a54bf60a08f808264cf352c5109cb8e206d',
          height: 22831877,
          method: 'registry.RegisterNode',
          fee: '0.000000000',
          amount: '0.000000000',
          shares: '0.000000000',
          add: true,
          timestamp: 1736930687,
          time: 21,
          status: true,
          from: 'oasis1qq22fw848zvk97zc0x32vx2y4ff8dz2zx5temr0v',
        },

        // https://api.oasisscan.com/v2/mainnet/chain/transactions?method=registry.RegisterRuntime&runtime=false&page=1&size=1
        {
          txType: 'consensus',
          txHash: '3a2ab03593c6e49ce5b8a78538cd4ddbf528493578fb2e85884f81064bfec016',
          height: 21327977,
          method: 'registry.RegisterRuntime',
          fee: '0.000000000',
          amount: '0.000000000',
          shares: '0.000000000',
          add: true,
          timestamp: 1728043536,
          time: 8887196,
          status: true,
          from: 'oasis1qrvmxhcjpjvgel9dqfs6zrnza3hqjpa6ug2arc0d',
        },

        // https://api.oasisscan.com/v2/mainnet/chain/transactions?method=governance.CastVote&runtime=false&page=1&size=1
        {
          txType: 'consensus',
          txHash: 'e31b538bd077e6e31e7b445d69159ab2a504605834365f412d16f61f1026d470',
          height: 21169426,
          method: 'governance.CastVote',
          fee: '0.000000000',
          amount: '0.000000000',
          shares: '0.000000000',
          add: true,
          timestamp: 1727107550,
          time: 9823302,
          from: 'oasis1qpn83e8hm3gdhvpfv66xj3qsetkj3ulmkugmmxn3',
        },
      ]),
    ).toMatchSnapshot()
  })

  test('parse delegations', () => {
    expect({
      // https://api.oasisscan.com/v2/mainnet/account/delegations?address=oasis1qqnk4au603zs94k0d0n7c0hkx8t4p6r87s60axru&all=false&page=1&size=1
      delegations: parseDelegations([
        {
          validatorAddress: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
          validatorName: 'stakefish',
          icon: 'https://s3.amazonaws.com/keybase_processed_uploads/e1378cd4d5203ded716906687ad53905_360_360.jpg',
          entityAddress: '',
          shares: '706.988419241',
          amount: '1000.395287073',
          active: true,
        },
      ]),
      // https://api.oasisscan.com/v2/mainnet/account/debonding?address=oasis1qqnk4au603zs94k0d0n7c0hkx8t4p6r87s60axru&page=1&size=1
      debonding: parseDebonding([
        {
          validatorAddress: 'oasis1qpqz2ut6a6prfcjm64xnpnjhsnqny6jqfyav829v',
          validatorName: 'GoStaking',
          icon: 'https://s3.amazonaws.com/keybase_processed_uploads/796f004b2fa2a5ff17299d361b78b005_360_360.jpg',
          shares: '101.817386235',
          debondEnd: 38376,
          epochLeft: 336,
        },
      ]),
    }).toMatchSnapshot()
  })

  test('parse delegations without losing precision', () => {
    const delegations = [
      {
        validatorAddress: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
        validatorName: 'BinanceStaking',
        icon: '',
        entityAddress: '',
        shares: '1563114365108.133939632',
        amount: '1655615038322.038833148',
        active: true,
      },
    ]

    expect(parseDelegations(delegations)[0]).toEqual({
      validatorAddress: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
      amount: '1655615038322038833148',
      shares: '1563114365108133939632',
    })
  })
})
