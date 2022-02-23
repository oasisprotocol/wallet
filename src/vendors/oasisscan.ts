import { Account } from 'app/state/account/types'
import { Validator } from 'app/state/staking/types'
import {
  AccountsApi,
  AccountsRow,
  Configuration,
  OperationsListApi,
  ValidatorRow,
} from 'vendors/oasisscan/index'

export function getOasisscanAPIs(url: string | 'https://api.oasisscan.com/mainnet/') {
  const explorerConfig = new Configuration({
    basePath: url,
  })

  const accounts = new AccountsApi(explorerConfig)
  const operations = new OperationsListApi(explorerConfig)

  async function getAccount(address: string): Promise<Account> {
    const account = await accounts.getAccount({ accountId: address })
    if (account && account.code === 0) {
      return parseAccount(account.data)
    } else {
      throw new Error('Wrong response code') // TODO
    }
  }

  async function getAllValidators(): Promise<Validator[]> {
    const validators = await accounts.getValidatorsList({ pageSize: 500 })
    if (validators && validators.code === 0) {
      return parseValidatorsList(validators.data.list)
    } else {
      throw new Error('Wrong response code') // TODO
    }
  }

  return { getAccount, getAllValidators }
}

export function parseAccount(account: AccountsRow): Account {
  return {
    address: account.address,
    liquid_balance: parseFloat(account.available) * 10 ** 9,
  }
}

export function parseValidatorsList(validators: ValidatorRow[]): Validator[] {
  return validators.map(v => {
    return {
      address: v.entity_address,
      name: v.name,
      escrow: parseFloat(v.escrow) * 10 ** 9,
      current_rate: v.commission,
      status: v.status ? 'active' : 'inactive',
      media: {
        email_address: v.email,
        logotype: v.icon,
        twitter_acc: v.twitter,
        website_link: v.website,
      },
      rank: v.rank,
    } as Validator
  })
}
