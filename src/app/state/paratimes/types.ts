import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { ErrorPayload } from 'types/errors'
import { ParaTime } from '../../../config'

export enum TransactionFormSteps {
  TransferType = 'transferType',
  ParaTimeSelection = 'paraTimeSelection',
  TransactionRecipient = 'transactionRecipient',
  TransactionAmount = 'transactionAmount',
  TransactionConfirmation = 'transactionConfirmation',
  TransactionSummary = 'transactionSummary',
  TransactionError = 'transactionError',
}

export enum TransactionTypes {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

export interface TransactionForm {
  amount: string
  confirmation: boolean
  feeAmount: string
  feeGas: string
  paraTime?: ParaTime
  privateKey: string
  recipient: string
  type: TransactionTypes | undefined
}

export interface ParaTimesState {
  balance: StringifiedBigInt
  isLoading: boolean
  transactionError?: ErrorPayload
  transactionForm: TransactionForm
  transactionFormStep: TransactionFormSteps
}

export type Runtime = {
  address: string
  id: string
  decimals: number
}

export type ParaTimeTransaction = Pick<
  TransactionForm,
  'amount' | 'privateKey' | 'feeAmount' | 'feeGas' | 'recipient' | 'type'
>
