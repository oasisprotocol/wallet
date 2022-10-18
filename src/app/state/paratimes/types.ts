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
  paraTime?: ParaTime
  privateKey: string
  recipient: string
  type?: TransactionTypes
}

export interface ParaTimesState {
  isLoading: boolean
  transactionForm: TransactionForm
  transactionFormStep: TransactionFormSteps
}
