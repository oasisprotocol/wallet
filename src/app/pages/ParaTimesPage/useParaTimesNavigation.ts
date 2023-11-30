import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { paraTimesActions } from 'app/state/paratimes'
import { backend } from 'vendors/backend'
import { BackendAPIs } from 'config'
import { WalletType } from 'app/state/wallet/types'
import { selectType } from 'app/state/wallet/selectors'

export type ParaTimesNavigationHook = {
  canAccessParaTimesRoute: boolean
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
  const walletType = useSelector(selectType)
  const canAccessParaTimesRoute = backend() === BackendAPIs.OasisScan && walletType !== WalletType.UsbLedger
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
    canAccessParaTimesRoute,
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
