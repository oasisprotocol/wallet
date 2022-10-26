import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { ParaTime } from '../../../config'

export enum TransactionFormSteps {
  TransferType,
  ParaTimeSelection,
  TransactionRecipient,
  TransactionAmount,
  TransactionConfirmation,
  TransactionSummary,
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
  type?: TransactionTypes
}

export interface ParaTimesState {
  balance: StringifiedBigInt
  isLoading: boolean
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
