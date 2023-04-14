import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { selectParaTimes } from 'app/state/paratimes/selectors'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { TransactionFormSteps } from 'app/state/paratimes/types'
import { ExhaustedTypeError } from 'types/errors'
import { ParaTimesPageInaccessible } from './ParaTimesPageInaccessible'
import { ParaTimeTransferType } from './ParaTimeTransferType'
import { ParaTimeSelection } from './ParaTimeSelection'
import { TransactionRecipient } from './TransactionRecipient'
import { TransactionAmount } from './TransactionAmount'
import { TransactionConfirmation } from './TransactionConfirmation'
import { TransactionSummary } from './TransactionSummary'
import { TransactionError } from './TransactionError'
import { useParaTimes } from './useParaTimes'

const ActiveFormStepComponent = ({ step }: { step: TransactionFormSteps }) => {
  const { t } = useTranslation()
  switch (step) {
    case TransactionFormSteps.TransferType:
      return <ParaTimeTransferType />
    case TransactionFormSteps.ParaTimeSelection:
      return <ParaTimeSelection />
    case TransactionFormSteps.TransactionRecipient:
      return <TransactionRecipient />
    case TransactionFormSteps.TransactionAmount:
      return <TransactionAmount />
    case TransactionFormSteps.TransactionConfirmation:
      return <TransactionConfirmation />
    case TransactionFormSteps.TransactionSummary:
      return <TransactionSummary />
    case TransactionFormSteps.TransactionError:
      return <TransactionError />
    default:
      throw new ExhaustedTypeError(t('paraTimes.unsupportedFormStep', 'Unsupported form step'), step)
  }
}

export const ParaTimes = () => {
  const selectedNetwork = useSelector(selectSelectedNetwork)
  const { transactionFormStep } = useSelector(selectParaTimes)
  const isAddressInWallet = useSelector(selectIsAddressInWallet)
  const { clearTransactionForm } = useParaTimes()

  useEffect(() => {
    return () => {
      clearTransactionForm()
    }
  }, [clearTransactionForm])

  useEffect(() => {
    clearTransactionForm()
  }, [clearTransactionForm, selectedNetwork])

  return (
    <Box pad="medium" background="background-front" align="center">
      {isAddressInWallet ? (
        <ActiveFormStepComponent step={transactionFormStep} />
      ) : (
        <ParaTimesPageInaccessible />
      )}
    </Box>
  )
}
