import * as oasis from '@oasisprotocol/client'
import { DebondingDelegation, Delegation, Validator } from 'app/state/staking/types'
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import {
  AccountApi,
  AccountDebondingInfo,
  AccountDelegationsInfo,
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
    getAllValidators,
    getTransactionsList,
    getDelegations,
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
