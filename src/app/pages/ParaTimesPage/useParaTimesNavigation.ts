import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { paraTimesActions } from 'app/state/paratimes'

export type ParaTimesNavigationHook = {
  getParaTimesRoutePath: (address: string) => string
  navigateToAmount: () => void
  navigateToDeposit: () => void
  navigateToParaTimes: () => void
  navigateToRecipient: () => void
  navigateToConfirmation: () => void
  navigateToSummary: () => void
  navigateToWithdraw: () => void
  paraTimesRouteLabel: string
}

export const useParaTimesNavigation = (): ParaTimesNavigationHook => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const getParaTimesRoutePath = (address: string) => `/account/${address}/paratimes`
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
  const paraTimesRouteLabel = t('menu.paraTimes', 'ParaTimes')

  return {
    getParaTimesRoutePath,
    navigateToAmount,
    navigateToConfirmation,
    navigateToDeposit,
    navigateToParaTimes,
    navigateToRecipient,
    navigateToSummary,
    navigateToWithdraw,
    paraTimesRouteLabel,
  }
}
