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

const renderComponent = (store: any, { walletHasAccounts, isMobile }: MobileFooterNavigationProps) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MobileFooterNavigation walletHasAccounts={walletHasAccounts} isMobile={isMobile} />
      </MemoryRouter>
    </Provider>,
  )

describe('<MobileFooterNavigation />', () => {
  let store: ReturnType<typeof configureAppStore>
  const mockUseParaTimesNavigationResult = {
    getParaTimesRoutePath: (address: string) => address,
    paraTimesRouteLabel: 'MockParaTimesLabel',
  } as ParaTimesNavigationHook

  beforeEach(() => {
    jest.mocked(useParaTimesNavigation).mockReturnValue(mockUseParaTimesNavigationResult)
    store = configureAppStore({
      wallet: {
        selectedWallet: 'dummy',
        wallets: {
          dummy: {
            address: 'dummy',
          } as Wallet,
        },
      },
    })
  })

  it('should render component for mobile and when account is open', () => {
    renderComponent(store, { walletHasAccounts: true, isMobile: true })

    expect(screen.getByTestId('mobile-footer-navigation')).toBeInTheDocument()
    expect(screen.queryByText('MockParaTimesLabel')).toBeInTheDocument()
  })

  it('should not render component for non mobile', () => {
    renderComponent(store, { walletHasAccounts: true, isMobile: false })

    expect(screen.queryByTestId('mobile-footer-navigation')).not.toBeInTheDocument()
  })

  it('should not render component when account is not open', () => {
    renderComponent(store, { walletHasAccounts: false, isMobile: true })

    expect(screen.queryByTestId('mobile-footer-navigation')).not.toBeInTheDocument()
  })
})
