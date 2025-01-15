import * as oasis from '@oasisprotocol/client'
import { Account } from 'app/state/account/types'
import { Transaction, TransactionStatus, TransactionType } from 'app/state/transaction/types'
import { DebondingDelegation, Delegation, Validator } from 'app/state/staking/types'
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import {
  AccountApi,
  AccountDebondingInfo,
  AccountDelegationsInfo,
  AccountInfoResponse,
  ChainApi,
  ChainTransactionInfoResponse,
  ChainTransactionListInfo,
  Configuration,
  RuntimeApi,
  RuntimeTransactionInfoResponse,
  ValidatorApi,
  ValidatorInfo,
} from 'vendors/oasisscan-v2/index'

import { throwAPIErrors } from './helpers'

const getTransactionCacheMap: Record<string, ChainTransactionInfoResponse> = {}
const getRuntimeTransactionInfoCacheMap: Record<string, RuntimeTransactionInfoResponse> = {}

export function getOasisscanV2APIs(url: string | 'https://api.oasisscan.com/v2/mainnet') {
  const explorerConfig = new Configuration({
    basePath: url,
    ...throwAPIErrors,
  })

  const accountApi = new AccountApi(explorerConfig)
  const chainApi = new ChainApi(explorerConfig)
  const validatorApi = new ValidatorApi(explorerConfig)
  const runtimeApi = new RuntimeApi(explorerConfig)

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

  function getRuntimeTransactionInfoUrl(filter: { id: string; hash: string }) {
    const searchParams = new URLSearchParams(filter)
    searchParams.sort()
    return `${url}/runtime/transaction/info?${searchParams.toString()}`
  }

  async function getRuntimeTransactionInfo(tx: ChainTransactionListInfo) {
    const cacheId = getRuntimeTransactionInfoUrl({ id: tx.runtimeId!, hash: tx.txHash! })

    if (cacheId in getRuntimeTransactionInfoCacheMap) {
      return getRuntimeTransactionInfoCacheMap[cacheId]
    }

    const runtimeTransaction = await runtimeApi.runtimeTransactionInfoHandler({
      id: tx.runtimeId!,
      hash: tx.txHash!,
      round: tx.round!,
    })

    if (runtimeTransaction) {
      getRuntimeTransactionInfoCacheMap[cacheId] = runtimeTransaction
    }

    return runtimeTransaction
  }

  function getTransactionUrl({ hash }: { hash: string }) {
    return `${url}/chain/transaction/${hash}`
  }

  async function getTransaction({ hash }: { hash: string }) {
    const cacheId = getTransactionUrl({ hash })

    if (cacheId in getTransactionCacheMap) {
      return getTransactionCacheMap[cacheId]
    }

    const transaction = await chainApi.chainTransactionInfoHandler({
      hash,
    })

    if (transaction) {
      getTransactionCacheMap[cacheId] = transaction
    }

    return transaction
  }

  async function getTransactionsList(params: { accountId: string; limit: number }) {
    const transactionsList = await chainApi.chainTransactionsHandler({
      address: params.accountId,
      size: params.limit,
      page: 1,
      runtime: true,
    })
    if (!transactionsList) throw new Error('Wrong response code')

    const list = await Promise.all(
      transactionsList.list.map(async tx => {
        if (tx.txType === 'runtime') {
          return await getRuntimeTransactionInfo(tx)
        } else {
          const { nonce } = await getTransaction({ hash: tx.txHash! })
          return { ...tx, nonce }
        }
      }),
    )

    return parseTransactionsList(list)
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

export function parseAccount(account: AccountInfoResponse): Account {
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

export function parseValidatorsList(validators: ValidatorInfo[]): Validator[] {
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

export function parseTransactionsList(
  list: (ChainTransactionListInfo | RuntimeTransactionInfoResponse)[],
): Transaction[] {
  return list.map(t => {
    if ('ctx' in t) {
      const parsed: Transaction = {
        amount: t.ctx.amount == null ? undefined : parseRoseStringToBaseUnitString(t.ctx.amount),
        fee: undefined,
        from: t.ctx.from,
        hash: t.txHash,
        level: undefined,
        status: t.result ? TransactionStatus.Successful : TransactionStatus.Failed,
        timestamp: t.timestamp * 1000,
        to: t.ctx.to ?? undefined,
        type: t.ctx.method as TransactionType,
        runtimeName: t.runtimeName,
        runtimeId: t.runtimeId,
        round: t.round,
        nonce:
          t.ctx?.nonce ?? t.etx?.nonce != null ? BigInt(t.ctx?.nonce ?? t.etx?.nonce).toString() : undefined,
      }
      return parsed
    } else {
      const parsed: Transaction = {
        amount: t.amount == null ? undefined : parseRoseStringToBaseUnitString(t.amount),
        fee: t.fee ? parseRoseStringToBaseUnitString(t.fee) : undefined,
        from: t.from,
        hash: t.txHash!,
        level: t.height,
        status: t.status ? TransactionStatus.Successful : TransactionStatus.Failed,
        timestamp: t.timestamp ? t.timestamp * 1000 : undefined,
        to: t.to ?? undefined,
        type: t.method as TransactionType,
        runtimeName: undefined,
        runtimeId: undefined,
        round: undefined,
        nonce: undefined,
      }
      return parsed
    }
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
