import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { Wallet } from 'app/state/wallet/types'
import {
  useParaTimesNavigation,
  ParaTimesNavigationHook,
} from '../../../pages/ParaTimesPage/useParaTimesNavigation'
import { MobileFooterNavigation, MobileFooterNavigationProps } from '..'

jest.mock('../../../pages/ParaTimesPage/useParaTimesNavigation')

const renderComponent = (store: any, { isAccountOpen, isMobile }: MobileFooterNavigationProps) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MobileFooterNavigation isAccountOpen={isAccountOpen} isMobile={isMobile} />
      </MemoryRouter>
    </Provider>,
  )

describe('<MobileFooterNavigation />', () => {
  let store: ReturnType<typeof configureAppStore>
  const mockUseParaTimesNavigationResult = {
    canAccessParaTimesRoute: false,
    getParaTimesRoutePath: (address: string) => address,
    paraTimesRouteLabel: 'MockParaTimesLabel',
  } as ParaTimesNavigationHook

  beforeEach(() => {
    jest.mocked(useParaTimesNavigation).mockReturnValue(mockUseParaTimesNavigationResult)
    store = configureAppStore({
      wallet: {
        isOpen: true,
        selectedWallet: 0,
        wallets: {
          0: {
            address: 'dummy',
            id: 1,
          } as Wallet,
        },
      },
    })
  })

  it('should render component for mobile and when account is open', () => {
    renderComponent(store, { isAccountOpen: true, isMobile: true })

    expect(screen.getByTestId('mobile-footer-navigation')).toBeInTheDocument()
    expect(screen.queryByText('MockParaTimesLabel')).not.toBeInTheDocument()
  })

  it('should not render component for non mobile', () => {
    renderComponent(store, { isAccountOpen: true, isMobile: false })

    expect(screen.queryByTestId('mobile-footer-navigation')).not.toBeInTheDocument()
  })

  it('should not render component when account is not open', () => {
    renderComponent(store, { isAccountOpen: false, isMobile: true })

    expect(screen.queryByTestId('mobile-footer-navigation')).not.toBeInTheDocument()
  })

  it('should render paraTime link', () => {
    jest.mocked(useParaTimesNavigation).mockReturnValue({
      ...mockUseParaTimesNavigationResult,
      canAccessParaTimesRoute: true,
    })
    renderComponent(store, { isAccountOpen: true, isMobile: true })

    expect(screen.getByText('MockParaTimesLabel')).toBeInTheDocument()
    expect(screen.getByLabelText('Inherit')).toBeInTheDocument()
  })
})
