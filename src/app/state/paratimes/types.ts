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
  confirmTransfer: boolean
  confirmTransferToValidator: boolean
  confirmTransferToForeignAccount: boolean
  defaultFeeAmount: string
  ethPrivateKey: string
  feeAmount: string
  feeGas: string
  paraTime?: ParaTime
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
  feeGas: bigint
}

export type ParaTimeTransaction = Pick<
  TransactionForm,
  'amount' | 'ethPrivateKey' | 'feeAmount' | 'feeGas' | 'recipient' | 'type'
>
