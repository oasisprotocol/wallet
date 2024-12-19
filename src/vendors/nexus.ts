import * as oasis from '@oasisprotocol/client'
import {
  Configuration,
  Account as NexusAccount,
  Delegation as NexusDelegation,
  DebondingDelegation as NexusDebondingDelegation,
  DefaultApi as NexusApi,
  Transaction as NexusTransaction,
  RuntimeTransaction as NexusRuntimeTransaction,
  Validator as NexusValidator,
  ConsensusTxMethod,
  Runtime,
  RuntimeTransaction,
  ConsensusEventType,
} from 'vendors/nexus/index'
import { Account } from 'app/state/account/types'
import { Transaction, TransactionStatus, TransactionType } from 'app/state/transaction/types'
import { DebondingDelegation, Delegation, Validator } from 'app/state/staking/types'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { throwAPIErrors } from './helpers'
import { removeTrailingZeros } from 'app/lib/helpers'
import { consensusDecimals, paraTimesConfig } from '../config'

export interface ExtendedRuntimeTransaction extends NexusRuntimeTransaction {
  decimals: number
  runtimeId: Runtime
  runtimeName: string
}

export function getNexusAPIs(url: string | 'https://nexus.oasis.io/v1/') {
  const explorerConfig = new Configuration({
    basePath: url,
    fetchApi: throwAPIErrors.fetchApi,
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

  function extendRuntimeTransaction(
    runtime: Runtime,
    runtimeTransaction: RuntimeTransaction,
  ): ExtendedRuntimeTransaction {
    const config =
      runtime === Runtime.Sapphire
        ? paraTimesConfig.sapphire
        : runtime === Runtime.Emerald
        ? paraTimesConfig.emerald
        : undefined

    return {
      ...runtimeTransaction,
      decimals: config?.decimals || consensusDecimals,
      runtimeId: runtime,
      runtimeName: runtime.charAt(0).toUpperCase() + runtime.slice(1),
    }
  }

  function mergeTransactions(
    limit: number,
    ...responses: (NexusTransaction | ExtendedRuntimeTransaction)[][]
  ): (NexusTransaction | ExtendedRuntimeTransaction)[] {
    const mergedList = responses.flat()
    mergedList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return mergedList.slice(0, limit)
  }

  async function getTransactionsList(params: { accountId: string; limit: number }) {
    try {
      const [consensusResponse, sapphireResponse, emeraldResponse] = await Promise.all([
        api.consensusTransactionsGet({
          rel: params.accountId,
          limit: params.limit,
        }),
        api.runtimeTransactionsGet({
          runtime: Runtime.Sapphire,
          rel: params.accountId,
          limit: params.limit,
        }),
        api.runtimeTransactionsGet({
          runtime: Runtime.Emerald,
          rel: params.accountId,
          limit: params.limit,
        }),
      ])
      const extendedSapphireResponse = sapphireResponse.transactions.map(runtimeTransaction =>
        extendRuntimeTransaction(Runtime.Sapphire, runtimeTransaction),
      )
      const extendedEmeraldResponse = emeraldResponse.transactions.map(runtimeTransaction =>
        extendRuntimeTransaction(Runtime.Emerald, runtimeTransaction),
      )
      const mergedTransactions = mergeTransactions(
        params.limit,
        consensusResponse.transactions,
        extendedSapphireResponse,
        extendedEmeraldResponse,
      )

      // Temporary workaround for missing amount in staking.ReclaimEscrow
      const transactionsWithFixedAmount = await Promise.all(
        mergedTransactions.map(async transaction => {
          if (transaction.method === ConsensusTxMethod.StakingReclaimEscrow) {
            const eventsResponse = await api.consensusEventsGet({
              limit: 1,
              txHash: transaction.hash,
              type: ConsensusEventType.StakingEscrowDebondingStart,
            })
            const amount = (eventsResponse.events[0].body as { amount?: number })?.amount
            return {
              ...transaction,
              body: {
                ...transaction.body,
                amount,
              },
            }
          }
          return { ...transaction }
        }),
      )

      return parseTransactionsList(transactionsWithFixedAmount)
    } catch (error) {
      console.error('Could not fetch Nexus', error)
      throw error
    }
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

function getTransactionType(method: string | undefined): TransactionType {
  const type = transactionMethodMap[method as keyof typeof transactionMethodMap]
  // Not handled mappings are rendered as unrecognizedTransaction
  return type ?? (method as TransactionType)
}

export const transactionMethodMap: Partial<{
  [k in ConsensusTxMethod]: TransactionType
}> = {
  [ConsensusTxMethod.StakingTransfer]: TransactionType.StakingTransfer,
  [ConsensusTxMethod.StakingAddEscrow]: TransactionType.StakingAddEscrow,
  [ConsensusTxMethod.StakingReclaimEscrow]: TransactionType.StakingReclaimEscrow,
  [ConsensusTxMethod.StakingAmendCommissionSchedule]: TransactionType.StakingAmendCommissionSchedule,
  [ConsensusTxMethod.StakingAllow]: TransactionType.StakingAllow,
  [ConsensusTxMethod.StakingWithdraw]: TransactionType.StakingWithdraw,
  [ConsensusTxMethod.StakingBurn]: TransactionType.StakingBurn,
  [ConsensusTxMethod.RoothashExecutorCommit]: TransactionType.RoothashExecutorCommit,
  [ConsensusTxMethod.RoothashExecutorProposerTimeout]: TransactionType.RoothashExecutorProposerTimeout,
  [ConsensusTxMethod.RoothashSubmitMsg]: TransactionType.RoothashSubmitMsg,
  [ConsensusTxMethod.RegistryDeregisterEntity]: TransactionType.RegistryDeregisterEntity,
  [ConsensusTxMethod.RegistryRegisterEntity]: TransactionType.RegistryRegisterEntity,
  [ConsensusTxMethod.RegistryRegisterNode]: TransactionType.RegistryRegisterNode,
  [ConsensusTxMethod.RegistryRegisterRuntime]: TransactionType.RegistryRegisterRuntime,
  [ConsensusTxMethod.RegistryUnfreezeNode]: TransactionType.RegistryUnfreezeNode,
  [ConsensusTxMethod.GovernanceCastVote]: TransactionType.GovernanceCastVote,
  [ConsensusTxMethod.GovernanceSubmitProposal]: TransactionType.GovernanceSubmitProposal,
  [ConsensusTxMethod.BeaconPvssCommit]: TransactionType.BeaconPvssCommit,
  [ConsensusTxMethod.BeaconPvssReveal]: TransactionType.BeaconPvssReveal,
  [ConsensusTxMethod.BeaconVrfProve]: TransactionType.BeaconVrfProve,
  [ConsensusTxMethod.ConsensusMeta]: TransactionType.ConsensusMeta,
  [ConsensusTxMethod.VaultCreate]: TransactionType.VaultCreate,
}

function parseTransactionsList(list: (NexusTransaction | ExtendedRuntimeTransaction)[]): Transaction[] {
  return list.map(t => {
    if ('round' in t) {
      const transactionDate = new Date(t.timestamp)
      const parsed: Transaction = {
        amount: t.amount ? removeTrailingZeros(t.amount, t.decimals - consensusDecimals) : undefined,
        fee: t.fee ? removeTrailingZeros(t.fee, t.decimals - consensusDecimals) : undefined,
        from: t.sender_0_eth || t.sender_0,
        hash: t.hash,
        level: undefined,
        status: t.success ? TransactionStatus.Successful : TransactionStatus.Failed,
        timestamp: transactionDate.getTime(),
        to: (t.body as { to?: string }).to ?? undefined,
        type: getTransactionType(t.method),
        runtimeName: t.runtimeName,
        runtimeId: t.runtimeId,
        round: t.round,
        nonce: BigInt(t.nonce_0).toString(),
      }
      return parsed
    } else {
      const transactionDate = new Date(t.timestamp)
      const parsed: Transaction = {
        amount:
          (t.body as { amount?: StringifiedBigInt })?.amount ||
          ((t.body as { amount_change?: StringifiedBigInt })?.amount_change &&
            ((t.body as { negative?: boolean })?.negative
              ? `-${(t.body as { amount_change?: StringifiedBigInt }).amount_change}`
              : (t.body as { amount_change?: StringifiedBigInt }).amount_change)) ||
          undefined,
        fee: t.fee,
        from: t.sender,
        hash: t.hash,
        level: t.block,
        status: t.success ? TransactionStatus.Successful : TransactionStatus.Failed,
        timestamp: transactionDate.getTime(),
        to:
          (t.body as { to?: StringifiedBigInt })?.to ||
          (t.body as { beneficiary?: StringifiedBigInt })?.beneficiary ||
          (t.body as { account?: StringifiedBigInt })?.account ||
          undefined,
        type: getTransactionType(t.method),
        runtimeName: undefined,
        runtimeId: undefined,
        round: undefined,
        nonce: BigInt(t.nonce).toString(),
      }
      return parsed
    }
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
