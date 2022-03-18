import { Account } from 'app/state/account/types'
import { Validator } from 'app/state/staking/types'
import { Transaction, TransactionType } from 'app/state/transaction/types'
import { parseStringValueToInt } from 'app/lib/helpers'
import {
  AccountsApi,
  AccountsRow,
  Configuration,
  OperationsListApi,
  ValidatorRow,
  OperationsRow,
  OperationsRowMethodEnum,
} from 'vendors/oasisscan/index'

import { sortByStatus } from './helpers'

export function getOasisscanAPIs(url: string | 'https://api.oasisscan.com/mainnet/') {
  const explorerConfig = new Configuration({
    basePath: url,
  })

  const accounts = new AccountsApi(explorerConfig)
  const operations = new OperationsListApi(explorerConfig)

  async function getAccount(address: string): Promise<Account> {
    const account = await accounts.getAccount({ accountId: address })
    if (!account || account.code !== 0) throw new Error('Wrong response code') // TODO
    return parseAccount(account.data)
  }

  async function getAllValidators(): Promise<Validator[]> {
    const validators = await accounts.getValidatorsList({ pageSize: 500 })
    if (!validators || validators.code !== 0) throw new Error('Wrong response code') // TODO
    return parseValidatorsList(validators.data.list)
  }

  async function getTransactionsList(params: { accountId: string; limit: number }): Promise<Transaction[]> {
    const transactionsList = await operations.getTransactionsList({
      address: params.accountId,
      size: params.limit,
      runtime: false,
    })
    if (!transactionsList || transactionsList.code !== 0) throw new Error('Wrong response code') // TODO
    return parseTransactionsList(transactionsList.data.list)
  }

  return { accounts, operations, getAccount, getAllValidators, getTransactionsList }
}

export function parseAccount(account: AccountsRow): Account {
  return {
    address: account.address,
    liquid_balance: parseStringValueToInt(account.available),
  }
}

export function parseValidatorsList(validators: ValidatorRow[]): Validator[] {
  return validators
    .map(v => {
      const parsed: Validator = {
        address: v.entity_address,
        name: v.name ?? undefined,
        nodeAddress: v.node_address,
        escrow: parseStringValueToInt(v.escrow),
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
    .sort(sortByStatus)
}

export const transactionMethodMap: { [k in OperationsRowMethodEnum]: TransactionType } = {
  [OperationsRowMethodEnum.StakingTransfer]: TransactionType.StakingTransfer,
  [OperationsRowMethodEnum.StakingAddEscrow]: TransactionType.StakingAddEscrow,
  [OperationsRowMethodEnum.StakingReclaimEscrow]: TransactionType.StakingReclaimEscrow,
  [OperationsRowMethodEnum.StakingAllow]: TransactionType.StakingAllow,
  [OperationsRowMethodEnum.StakingAmendCommissionSchedule]: TransactionType.StakingAmendCommissionSchedule,
  [OperationsRowMethodEnum.RoothashExecutorCommit]: TransactionType.RoothashExecutorCommit,
  [OperationsRowMethodEnum.RoothashExecutorProposerTimeout]: TransactionType.RoothashExecutorProposerTimeout,
  [OperationsRowMethodEnum.RegistryRegisterEntity]: TransactionType.RegistryRegisterEntity,
  [OperationsRowMethodEnum.RegistryRegisterNode]: TransactionType.RegistryRegisterNode,
  [OperationsRowMethodEnum.RegistryRegisterRuntime]: TransactionType.RegistryRegisterRuntime,
  [OperationsRowMethodEnum.GovernanceCastVote]: TransactionType.GovernanceCastVote,
  [OperationsRowMethodEnum.BeaconPvssCommit]: TransactionType.BeaconPvssCommit,
  [OperationsRowMethodEnum.BeaconPvssReveal]: TransactionType.BeaconPvssReveal,
}

export function parseTransactionsList(transactionsList: OperationsRow[]): Transaction[] {
  return transactionsList.map(t => {
    const parsed: Transaction = {
      amount: t.amount == null ? undefined : parseStringValueToInt(t.amount),
      fee: parseStringValueToInt(t.fee),
      from: t.from,
      hash: t.tx_hash,
      level: t.height,
      status: t.status,
      timestamp: t.timestamp,
      to: t.to ?? undefined,
      type: transactionMethodMap[t.method],
    }
    return parsed
  })
}
