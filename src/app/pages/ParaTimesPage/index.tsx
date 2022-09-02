import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box } from 'grommet'
import { selectParaTimes } from 'app/state/paratimes/selectors'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { TransactionFormSteps } from 'app/state/paratimes/types'
import { ParaTimesPageInaccessible } from './ParaTimesPageInaccessible'
import { ParaTimeTransferType } from './ParaTimeTransferType'
import { ParaTimeSelection } from './ParaTimeSelection'
import { TransactionRecipient } from './TransactionRecipient'
import { TransactionAmount } from './TransactionAmount'
import { TransactionConfirmation } from './TransactionConfirmation'
import { TransactionSummary } from './TransactionSummary'
import { useParaTimes } from './useParaTimes'

const getActiveFormStepComponent = (step: number) => {
  switch (step) {
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
    default:
      return <ParaTimeTransferType />
  }
}

export const ParaTimes = () => {
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
      {isAddressInWallet ? getActiveFormStepComponent(transactionFormStep) : <ParaTimesPageInaccessible />}
    </Box>
  )
}
