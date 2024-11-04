import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { paraTimesActions } from 'app/state/paratimes'
import { TransactionForm, TransactionTypes } from 'app/state/paratimes/types'
import { selectSelectedNetwork, selectTicker } from 'app/state/network/selectors'
import { selectAccountAvailableBalance, selectAccountIsLoading } from 'app/state/account/selectors'
import { selectAddress } from 'app/state/wallet/selectors'
import { selectParaTimes } from 'app/state/paratimes/selectors'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { ErrorPayload } from 'types/errors'
import { paraTimesConfig, RuntimeTypes, ParaTime, type ParaTimeConfig } from '../../../config'
import { selectEvmAccounts } from 'app/state/evmAccounts/selectors'
import { EvmAccount } from 'app/state/evmAccounts/types'
import { getParaTimeName } from './getParaTimeName'

type AvailableParaTimesForNetwork = {
  isEvm: boolean
  value: ParaTime
}

const evmcParaTimes = Object.keys(paraTimesConfig).filter(
  key => paraTimesConfig[key as ParaTime].type === RuntimeTypes.Evm,
)

export type ParaTimesHook = {
  accountAddress: string | undefined
  accountIsLoading: boolean
  availableParaTimesForSelectedNetwork: AvailableParaTimesForNetwork[]
  balance: StringifiedBigInt | null
  balanceInBaseUnit: boolean
  clearTransactionForm: () => void
  evmAccounts: EvmAccount[]
  isDepositing: boolean
  isEvmcParaTime: boolean
  isLoading: boolean
  isWalletEmpty: boolean
  paraTimeConfig: ParaTimeConfig
  paraTimeName: string
  setTransactionForm: (formValues: TransactionForm) => void
  submitTransaction: () => void
  ticker: string
  transactionError: ErrorPayload | undefined
  transactionForm: TransactionForm
  usesOasisAddress: boolean
}

export const useParaTimes = (): ParaTimesHook => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const clearTransactionForm = useCallback(() => {
    dispatch(paraTimesActions.clearTransactionForm())
  }, [dispatch])
  const submitTransaction = useCallback(() => {
    dispatch(paraTimesActions.submitTransaction())
  }, [dispatch])
  const setTransactionForm = (formValues: TransactionForm) =>
    dispatch(paraTimesActions.setTransactionForm(formValues))
  const { balance, isLoading, transactionError, transactionForm } = useSelector(selectParaTimes)
  const accountBalance = useSelector(selectAccountAvailableBalance)
  const accountIsLoading = useSelector(selectAccountIsLoading)
  const accountAddress = useSelector(selectAddress)
  const evmAccounts = useSelector(selectEvmAccounts)
  const selectedNetwork = useSelector(selectSelectedNetwork)
  const ticker = useSelector(selectTicker)
  const isDepositing = transactionForm.type !== TransactionTypes.Withdraw
  const isEvmcParaTime = evmcParaTimes.includes(transactionForm.paraTime!)
  const needsEthAddress = isDepositing && isEvmcParaTime
  const balanceInBaseUnit = isDepositing || (!isDepositing && !isEvmcParaTime)
  const paraTimeName = transactionForm.paraTime ? getParaTimeName(t, transactionForm.paraTime) : ''
  const availableParaTimesForSelectedNetwork: AvailableParaTimesForNetwork[] = (
    Object.keys(paraTimesConfig) as ParaTime[]
  )
    .filter(paraTimeKey => paraTimesConfig[paraTimeKey][selectedNetwork].runtimeId)
    .sort((a, b) => paraTimesConfig[a].displayOrder - paraTimesConfig[b].displayOrder)
    .map(paraTimeKey => ({
      isEvm: paraTimesConfig[paraTimeKey].type === RuntimeTypes.Evm,
      value: paraTimeKey,
    }))
  const walletBalance = !isDepositing ? balance : accountBalance
  const paraTimeConfig = paraTimesConfig[transactionForm.paraTime!]

  return {
    accountAddress,
    accountIsLoading,
    availableParaTimesForSelectedNetwork,
    balance: walletBalance,
    balanceInBaseUnit,
    clearTransactionForm,
    evmAccounts,
    isDepositing,
    isEvmcParaTime,
    isLoading,
    isWalletEmpty: walletBalance === '0',
    paraTimeConfig,
    paraTimeName,
    setTransactionForm,
    submitTransaction,
    ticker,
    transactionError,
    transactionForm,
    usesOasisAddress: !needsEthAddress,
  }
}
