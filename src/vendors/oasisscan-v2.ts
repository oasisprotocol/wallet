import * as oasis from '@oasisprotocol/client'
import { Account } from 'app/state/account/types'
import { DebondingDelegation, Delegation, Validator } from 'app/state/staking/types'
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import {
  AccountApi,
  AccountDebondingInfo,
  AccountDelegationsInfo,
  AccountInfoResponse,
  Configuration,
  ValidatorApi,
  ValidatorInfo,
} from 'vendors/oasisscan-v2/index'

import { throwAPIErrors } from './helpers'

export function getOasisscanV2APIs(url: string | 'https://api.oasisscan.com/v2/mainnet') {
  const explorerConfig = new Configuration({
    basePath: url,
    ...throwAPIErrors,
  })

  const accountApi = new AccountApi(explorerConfig)
  const validatorApi = new ValidatorApi(explorerConfig)

  async function getAccount(address: string): Promise<Account> {
    const account = await accountApi.accountInfoHandler({ address })
    if (!account) throw new Error('Wrong response code')

    return parseAccount(account)
  }

  async function getAllValidators(): Promise<Validator[]> {
    const validators = await validatorApi.validatorListHandler({ orderBy: 'escrow', sort: 'desc' })
    if (!validators) throw new Error('Wrong response code')

    return parseValidatorsList(validators.list)
  }

  async function getTransactionsList(params: { accountId: string; limit: number }) {
    return []
  }

  async function getDelegations(params: { accountId: string; nic: oasis.client.NodeInternal }): Promise<{
    delegations: Delegation[]
    debonding: DebondingDelegation[]
  }> {
    const delegations = await accountApi.accountDelegationsHandler({
      all: true,
      address: params.accountId,
      page: 1,
      size: 500,
    })
    const debonding = await accountApi.accountDebondingHandler({
      address: params.accountId,
      page: 1,
      size: 500,
    })
    if (!delegations) throw new Error('Wrong response code')
    if (!debonding) throw new Error('Wrong response code')

    return {
      delegations: parseDelegations(delegations.list),
      debonding: parseDebonding(debonding.list),
    }
  }

  return {
    getAccount,
    getAllValidators,
    getTransactionsList,
    getDelegations,
  }
}

function parseAccount(account: AccountInfoResponse): Account {
  return {
    address: account.address,
    allowances: account.allowances.map(allowance => ({
      address: allowance.address,
      amount: parseRoseStringToBaseUnitString(allowance.amount),
    })),
    available: parseRoseStringToBaseUnitString(account.available),
    delegations: parseRoseStringToBaseUnitString(account.escrow),
    debonding: parseRoseStringToBaseUnitString(account.debonding),
    total: parseRoseStringToBaseUnitString(account.total),
    nonce: BigInt(account.nonce ?? 0).toString(),
  }
}

function parseValidatorsList(validators: ValidatorInfo[]): Validator[] {
  return validators.map(v => {
    const parsed: Validator = {
      address: v.entityAddress,
      name: v.name ?? undefined,
      escrow: parseRoseStringToBaseUnitString(v.escrow),
      current_rate: v.commission,
      status: v.status ? 'active' : 'inactive',
      media: {
        email_address: v.email ?? undefined,
        logotype: v.icon ?? undefined,
        twitter_acc: v.twitter ?? undefined,
        website_link: v.website ?? undefined,
      },
      rank: v.rank,
    }
    return parsed
  })
}

export function parseDelegations(delegations: AccountDelegationsInfo[]): Delegation[] {
  return delegations.map(delegation => {
    const parsed: Delegation = {
      amount: parseRoseStringToBaseUnitString(delegation.amount),
      shares: parseRoseStringToBaseUnitString(delegation.shares),
      validatorAddress: delegation.validatorAddress ?? delegation.entityAddress,
    }
    return parsed
  })
}
export function parseDebonding(debonding: AccountDebondingInfo[]): DebondingDelegation[] {
  return debonding.map(debonding => {
    const parsed: DebondingDelegation = {
      // TODO: use amount field, or share price when it is available. Until then,
      // using shares is inaccurate if debonding pool gets slashed.
      amount: parseRoseStringToBaseUnitString(debonding.shares),
      shares: parseRoseStringToBaseUnitString(debonding.shares),
      validatorAddress: debonding.validatorAddress,
      epoch: debonding.debondEnd,
    }
    return parsed
  })
}
