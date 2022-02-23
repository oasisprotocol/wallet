import { parseValidatorsList, parseAccount } from './monitor'

test('parse account', () => {
  expect(
    // https://monitor.oasis.dev/data/accounts/oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe
    parseAccount({
      address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
      liquid_balance: 756455428396,
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
