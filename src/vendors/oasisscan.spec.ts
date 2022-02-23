import { parseValidatorsList, parseAccount } from './oasisscan'

describe('oasisscan', () => {
  test('parse account', () => {
    expect(
      // https://api.oasisscan.com/mainnet/chain/account/info/oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe
      parseAccount({
        rank: 0,
        address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
        available: '756.455428396',
        escrow: '1460535.533308247',
        debonding: '0',
        total: '1461291.988735606',
        nonce: 2,
        allowances: [],
      }),
    ).toMatchSnapshot()
  })

  test('parse validators', () => {
    expect(
      // https://api.oasisscan.com/mainnet/validator/list?pageSize=2
      parseValidatorsList([
        {
          rank: 1,
          entity_id: 'eZuacXy5s3/nolB/E3gF4vqUYdvfOlVaaBXGfZcGwKc=',
          entity_address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
          node_id: 'ked2iuR80WQdb4g7l+PqbQKGJAvD4+KVPFwuDc5nU6M=',
          node_address: 'oasis1qrg52ccz4ts6cct2qu4retxn7kkdlusjh5pe74ar',
          name: 's',
          icon: 'https://s3.amazonaws.com/s.jpg',
          website: 'https://stake.fish',
          twitter: 's',
          keybase: 'b',
          email: 's@s.f',
          description: null,
          escrow: '336904789.68',
          escrow_change24: '834847.28',
          escrow_percent: 0.0594,
          balance: '756.46',
          total_shares: '274945347.23',
          signs: 6662666,
          proposals: 195817,
          nonce: 0,
          score: 7054300,
          delegators: 8244,
          nodes: null,
          uptime: '100%',
          active: true,
          commission: 0.05,
          bound: null,
          rates: null,
          bounds: null,
          escrow_shares_status: null,
          escrow_amount_status: null,
          status: true,
        },
        {
          rank: 2,
          entity_id: '9sAhd+Wi6tG5nAr3LwXD0y9mUKLYqfAbS2+7SZdNHB4=',
          entity_address: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
          node_id: '6wbL5/OxvFGxi55o7AxcwKmfjXbXGC1hw4lfnEZxBXA=',
          node_address: 'oasis1qqp0h2h92eev7nsxgqctvuegt8ge3vyg0qyluc4k',
          name: 'b',
          icon: null,
          website: 'https://www.b.com',
          twitter: null,
          keybase: null,
          email: null,
          description: null,
          escrow: '326477290.61',
          escrow_change24: '396083.29',
          escrow_percent: 0.0575,
          balance: '37793.61',
          total_shares: '292703052.04',
          signs: 4524240,
          proposals: 263109,
          nonce: 0,
          score: 5050458,
          delegators: 10510,
          nodes: null,
          uptime: '100%',
          active: false,
          commission: 0.1,
          bound: null,
          rates: null,
          bounds: null,
          escrow_shares_status: null,
          escrow_amount_status: null,
          status: true,
        },
      ]),
    ).toMatchSnapshot()
  })
})
