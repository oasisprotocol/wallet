import { Account } from 'app/state/account/types'
import { Validator } from 'app/state/staking/types'
import {
  AccountsApi,
  AccountsRow,
  BlocksApi,
  Configuration,
  OperationsListApi,
  ValidatorCommissionScheduleRates,
  ValidatorRow,
} from 'vendors/explorer'

export function getMonitorAPIs(url: string) {
  const explorerConfig = new Configuration({
    basePath: url,
  })

  const accounts = new AccountsApi(explorerConfig)
  const blocks = new BlocksApi(explorerConfig)
  const operations = new OperationsListApi(explorerConfig)

  async function getAccount(address: string): Promise<Account> {
    const account = await accounts.getAccount({ accountId: address })
    return parseAccount(account)
  }

  async function getAllValidators(): Promise<Validator[]> {
    const validators = await accounts.getValidatorsList({ limit: 500 })
    return parseValidatorsList(validators)
  }

  return { accounts, blocks, operations, getAccount, getAllValidators }
}

export function parseAccount(account: AccountsRow): Account {
  return {
    address: account.address,
    escrow_balance: account.escrow_balance,
    escrow_debonding_balance: account.escrow_debonding_balance,
    liquid_balance: account.liquid_balance,
  }
}

export function parseValidatorsList(validators: ValidatorRow[]): Validator[] {
  return (
    validators
      // Always clone before sort so it doesn't mutate source
      .slice()
      .sort((a, b) => b.escrow_balance - a.escrow_balance)
      .map((v, index) => {
        return {
          address: v.account_id,
          name: v.account_name,
          escrow: v.escrow_balance,
          current_rate: computeCurrentRate(v.current_epoch!, v.commission_schedule?.rates ?? []),
          status: v.status,
          media: v.media_info,
          rank: index + 1,
        } as Validator
      })
  )
}

function computeCurrentRate(currentEpoch: number, rawRates: ValidatorCommissionScheduleRates[]) {
  const rates = rawRates
    .map(r => ({
      epochStart: r.start ? Number(r.start) : 0,
      rate: Number(r.rate!) / 100_000,
    }))
    // Always clone before sort so it doesn't mutate source
    .slice()
    .sort((a, b) => a.epochStart - b.epochStart)
    // If we have another bound after this one, attach the epochEnd to this one
    .map((b, i, array) => ({
      ...b,
      epochEnd: array[i + 1] ? array[i + 1].epochStart - 1 : undefined,
    }))

    // Filter out bounds that ended in the past
    .filter(b => !b.epochEnd || b.epochEnd > currentEpoch)

  if (!rates.length) {
    return undefined
  }
  return rates[rates.length - 1].rate
}
