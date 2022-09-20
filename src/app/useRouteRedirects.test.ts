import { renderHook } from '@testing-library/react-hooks'
import { useSelector } from 'react-redux'
import { selectAddress } from 'app/state/wallet/selectors'
import { useRouteRedirects } from './useRouteRedirects'
import { when } from 'jest-when'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('useRouteRedirects', () => {
  it('should redirects to account page', () => {
    when(useSelector as any)
      .calledWith(selectAddress)
      .mockReturnValue('dummyAddress')

    renderHook(() => useRouteRedirects())

    expect(mockNavigate).toHaveBeenCalledWith('/account/dummyAddress')
  })

  it('should not trigger redirect when active wallet is not defined', () => {
    when(useSelector as any)
      .calledWith(selectAddress)
      .mockReturnValue(undefined)

    renderHook(() => useRouteRedirects())

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
