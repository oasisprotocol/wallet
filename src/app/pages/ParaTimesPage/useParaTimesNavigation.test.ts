import { renderHook, act } from '@testing-library/react-hooks'
import { paraTimesActions } from 'app/state/paratimes'
import { useParaTimesNavigation } from './useParaTimesNavigation'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}))

describe('useParaTimesNavigation', () => {
  it('should dispatch redux actions', () => {
    const { result } = renderHook(() => useParaTimesNavigation())

    act(() => {
      result.current.navigateToAmount()
      result.current.navigateToDeposit()
      result.current.navigateToParaTimes()
      result.current.navigateToRecipient()
      result.current.navigateToConfirmation()
      result.current.navigateToSummary()
      result.current.navigateToWithdraw()
    })

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      payload: undefined,
      type: paraTimesActions.navigateToAmount.type,
    })
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      payload: undefined,
      type: paraTimesActions.navigateToDeposit.type,
    })
    expect(mockDispatch).toHaveBeenNthCalledWith(3, {
      payload: undefined,
      type: paraTimesActions.navigateToParaTimes.type,
    })
    expect(mockDispatch).toHaveBeenNthCalledWith(4, {
      payload: undefined,
      type: paraTimesActions.navigateToRecipient.type,
    })
    expect(mockDispatch).toHaveBeenNthCalledWith(5, {
      payload: undefined,
      type: paraTimesActions.navigateToConfirmation.type,
    })
    expect(mockDispatch).toHaveBeenNthCalledWith(6, {
      payload: undefined,
      type: paraTimesActions.navigateToSummary.type,
    })
    expect(mockDispatch).toHaveBeenNthCalledWith(7, {
      payload: undefined,
      type: paraTimesActions.navigateToWithdraw.type,
    })
  })

  it('should return main route label', () => {
    const { result } = renderHook(() => useParaTimesNavigation())

    expect(result.current.paraTimesRouteLabel).toEqual('menu.paraTimes')
  })

  it('should return main route path', () => {
    const { result } = renderHook(() => useParaTimesNavigation())

    expect(result.current.getParaTimesRoutePath('dummyAddress')).toEqual('/account/dummyAddress/paratimes')
  })
})
