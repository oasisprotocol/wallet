import { renderHook } from '@testing-library/react-hooks'
import { useSelector } from 'react-redux'
import { selectActiveWalletId, selectAddress } from 'app/state/wallet/selectors'
import { useRouteRedirects } from './useRouteRedirects'
import { when } from 'jest-when'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}))

const mockedHistoryPush = jest.fn()
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
}))

describe('useStartTrial', () => {
  beforeEach(() => {})

  it('should redirects to account page', () => {
    when(useSelector as any)
      .calledWith(selectAddress)
      .mockReturnValue('dummyAddress')
      .calledWith(selectActiveWalletId)
      .mockReturnValue(0)

    renderHook(() => useRouteRedirects())

    expect(mockedHistoryPush).toHaveBeenCalledWith('/account/dummyAddress')
  })

  it('should not trigger redirect when address is not defined', () => {
    when(useSelector as any)
      .calledWith(selectAddress)
      .mockReturnValue('')
      .calledWith(selectActiveWalletId)
      .mockReturnValue(1)

    renderHook(() => useRouteRedirects())

    expect(mockedHistoryPush).not.toHaveBeenCalled()
  })

  it('should not trigger redirect when active wallet id is missing', () => {
    when(useSelector as any)
      .calledWith(selectAddress)
      .mockReturnValue('dummyAddress')
      .calledWith(selectActiveWalletId)
      .mockReturnValue(undefined)

    renderHook(() => useRouteRedirects())

    expect(mockedHistoryPush).not.toHaveBeenCalled()
  })
})
