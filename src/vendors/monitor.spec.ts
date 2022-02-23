import { parseValidatorsList } from './monitor'

test('parse monitor validators', () => {
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
          website_link: 'https://s.com',
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
        status: 'inactive',
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
        status: 'inactive',
        depositors_count: 12687,
        blocks_count: 488714,
        signatures_count: 8382100,
      },
    ]),
  ).toMatchSnapshot()
})
