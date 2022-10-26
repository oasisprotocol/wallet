import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { Box } from 'grommet'
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

const getActiveFormStepComponent = (t: TFunction, step: TransactionFormSteps) => {
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
  const { t } = useTranslation()
  const { transactionFormStep } = useSelector(selectParaTimes)
  const isAddressInWallet = useSelector(selectIsAddressInWallet)
  const { resetTransactionForm } = useParaTimes()

  useEffect(() => {
    return () => {
      resetTransactionForm()
    }
  }, [resetTransactionForm])

  return (
    <Box pad="medium" background="background-front" align="center">
      {isAddressInWallet ? getActiveFormStepComponent(t, transactionFormStep) : <ParaTimesPageInaccessible />}
    </Box>
  )
}
