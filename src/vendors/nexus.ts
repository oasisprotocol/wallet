import * as oasis from '@oasisprotocol/client'
import {
  Configuration,
  Account as NexusAccount,
  Delegation as NexusDelegation,
  DebondingDelegation as NexusDebondingDelegation,
  DefaultApi as NexusApi,
  Validator as NexusValidator,
} from 'vendors/nexus/index'
import { Account } from 'app/state/account/types'
import { DebondingDelegation, Delegation, Validator } from 'app/state/staking/types'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { throwAPIErrors } from './helpers'

export function getNexusAPIs(url: string | 'https://nexus.oasis.io/v1/') {
  const explorerConfig = new Configuration({
    basePath: url,
    ...throwAPIErrors,
  })

  const api = new NexusApi(explorerConfig)

  async function getAccount(address: string): Promise<Account> {
    const account = await api.consensusAccountsAddressGet({ address })
    if (!account) throw new Error('Wrong response code')

    return parseAccount(account)
  }

  async function getAllValidators(): Promise<Validator[]> {
    const validatorsResponse = await api.consensusValidatorsGet({})
    if (!validatorsResponse) throw new Error('Wrong response code')

    return parseValidatorsList(validatorsResponse.validators)
  }

  async function getTransactionsList(params: { accountId: string; limit: number }) {
    return []
  }

  async function getDelegations(params: { accountId: string; nic: oasis.client.NodeInternal }): Promise<{
    delegations: Delegation[]
    debonding: DebondingDelegation[]
  }> {
    const delegations = await api.consensusAccountsAddressDelegationsGet({
      address: params.accountId,
    })
    const debonding = await api.consensusAccountsAddressDebondingDelegationsGet({
      address: params.accountId,
    })
    if (!delegations) throw new Error('Wrong response code')
    if (!debonding) throw new Error('Wrong response code')

    return {
      delegations: parseDelegations(delegations.delegations),
      debonding: parseDebonding(debonding.debonding_delegations),
    }
  }

  return {
    getAccount,
    getAllValidators,
    getTransactionsList,
    getDelegations,
  }
}

function parseAccount(account: NexusAccount): Account {
  const total = (
    BigInt(account.available) +
    BigInt(account.delegations_balance) +
    BigInt(account.debonding_delegations_balance)
  ).toString()

  return {
    address: account.address,
    allowances: account.allowances.map(allowance => ({
      address: allowance.address,
      amount: allowance.amount,
    })),
    available: account.available,
    delegations: account.delegations_balance,
    debonding: account.debonding_delegations_balance,
    total,
    nonce: BigInt(account.nonce ?? 0).toString(),
  }
}

function parseValidatorsList(validators: NexusValidator[]): Validator[] {
  return validators.map(v => {
    const parsed: Validator = {
      address: v.entity_address,
      name: v.media?.name ?? undefined,
      escrow: v.escrow.active_balance as StringifiedBigInt,
      current_rate: v.current_rate / 100000,
      status: v.active ? 'active' : 'inactive',
      media: {
        email_address: v.media?.email ?? undefined,
        logotype: v.media?.logoUrl ?? undefined,
        twitter_acc: v.media?.twitter ?? undefined,
        website_link: v.media?.url ?? undefined,
      },
      rank: v.rank,
    }
    return parsed
  })
}

export function parseDelegations(delegations: NexusDelegation[]): Delegation[] {
  return delegations.map(delegation => {
    const parsed: Delegation = {
      amount: delegation.amount,
      shares: delegation.shares,
      validatorAddress: delegation.validator,
    }
    return parsed
  })
}

export function parseDebonding(debonding: NexusDebondingDelegation[]): DebondingDelegation[] {
  return debonding.map(debonding => {
    const parsed: DebondingDelegation = {
      amount: debonding.shares,
      shares: debonding.shares,
      validatorAddress: debonding.validator,
      epoch: debonding.debond_end,
    }
    return parsed
  })
}
