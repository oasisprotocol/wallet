import { ErrorPayload } from 'types/errors'

/**
 * These are manually copied from Oasis-explorer. Later, oasis-explorer should
 * make those an enum so that we maintain strong typing across projects.
 */
export enum TransactionType {
  StakingTransfer = 'transfer',
  StakingAddEscrow = 'addescrow',
  StakingReclaimEscrow = 'reclaimescrow',
  StakingAllow = 'allow',
  StakingAmendCommissionSchedule = 'amendcommissionschedule',
  RoothashExecutorCommit = 'executorcommit',
  RoothashExecutorProposerTimeout = 'executorproposertimeout',
  RegistryRegisterEntity = 'registerentity',
  RegistryRegisterNode = 'registernode',
  RegistryRegisterRuntime = 'registerruntime',
  GovernanceCastVote = 'castvote',
  GovernanceSubmitProposal = 'submitproposal',
  BeaconPvssCommit = 'pvsscommit',
  BeaconPvssReveal = 'pvssreveal',
}

export interface Transaction {
  amount: number | undefined
  fee: number | undefined
  from: string | undefined
  hash: string
  level: number | undefined
  status: boolean | undefined
  timestamp: number | undefined
  to: string | undefined
  type: TransactionType
}

/* --- STATE --- */
export interface TransactionState {
  step?: TransactionStep
  active: boolean
  success: boolean
  error?: ErrorPayload
  preview?: TransactionPreview
}

export type NewTransactionType = 'transfer' | 'addEscrow' | 'reclaimEscrow'
export type TransactionPayload = TransferPayload | AddEscrowPayload | ReclaimEscrowPayload

export interface TransactionPreview {
  transaction: TransactionPayload
  fee?: string
  gas?: string
}

/**
 * Flow for a transaction to be sent.
 */
export enum TransactionStep {
  Building = 'building',
  Preview = 'preview',
  Signing = 'signing',
  Submitting = 'submitting',
  Sent = 'sent',
}

export interface TransactionSent {
  from: string
  to: string
  amount: number
}

export interface TransferPayload {
  type: 'transfer'

  /* bech32 Address */
  to: string

  /* Token amount */
  amount: number
}

export interface AddEscrowPayload {
  type: 'addEscrow'

  /* bech32 Address */
  validator: string

  /* Token amount */
  amount: number
}

export interface ReclaimEscrowPayload {
  type: 'reclaimEscrow'

  /* bech32 Address */
  validator: string

  /* Shares to be reclaimed */
  shares: number

  /* Amount to be reclaimed */
  amount: number
}
