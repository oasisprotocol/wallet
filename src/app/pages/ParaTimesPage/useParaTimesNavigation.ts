import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { paraTimesActions } from 'app/state/paratimes'

export type ParaTimesNavigationHook = {
  navigateToAmount: () => void
  navigateToDeposit: () => void
  navigateToParaTimes: () => void
  navigateToRecipient: () => void
  navigateToConfirmation: () => void
  navigateToSummary: () => void
  navigateToWithdraw: () => void
}

export const useParaTimesNavigation = (): ParaTimesNavigationHook => {
  const dispatch = useDispatch()

  const navigateToDeposit = useCallback(() => dispatch(paraTimesActions.navigateToDeposit()), [dispatch])
  const navigateToWithdraw = useCallback(() => dispatch(paraTimesActions.navigateToWithdraw()), [dispatch])
  const navigateToParaTimes = useCallback(() => dispatch(paraTimesActions.navigateToParaTimes()), [dispatch])
  const navigateToRecipient = useCallback(() => dispatch(paraTimesActions.navigateToRecipient()), [dispatch])
  const navigateToAmount = useCallback(() => dispatch(paraTimesActions.navigateToAmount()), [dispatch])
  const navigateToConfirmation = useCallback(
    () => dispatch(paraTimesActions.navigateToConfirmation()),
    [dispatch],
  )
  const navigateToSummary = useCallback(() => dispatch(paraTimesActions.navigateToSummary()), [dispatch])

  return {
    navigateToAmount,
    navigateToDeposit,
    navigateToParaTimes,
    navigateToRecipient,
    navigateToConfirmation,
    navigateToSummary,
    navigateToWithdraw,
  }
}
