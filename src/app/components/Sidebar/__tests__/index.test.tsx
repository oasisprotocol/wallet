import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { Wallet } from 'app/state/wallet/types'
import {
  useParaTimesNavigation,
  ParaTimesNavigationHook,
} from '../../../pages/ParaTimesPage/useParaTimesNavigation'
import { Navigation } from '..'

jest.mock('../../../pages/ParaTimesPage/useParaTimesNavigation')

const renderComponent = (store: any) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    </Provider>,
  )
}

describe('<Navigation />', () => {
  let store: ReturnType<typeof configureAppStore>
  const mockUseParaTimesNavigationResult = {
    getParaTimesRoutePath: (address: string) => address,
    paraTimesRouteLabel: 'MockParaTimesLabel',
  } as ParaTimesNavigationHook

  beforeEach(() => {
    jest.mocked(useParaTimesNavigation).mockReturnValue(mockUseParaTimesNavigationResult)
    store = configureAppStore({})
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('with account opened should match snapshot', () => {
    const component = renderComponent(
      configureAppStore({
        wallet: {
          selectedWallet: 'dummy',
          wallets: {
            dummy: {
              address: 'dummy',
            } as Wallet,
          },
        },
      }),
    )
    expect(component.container.firstChild).toMatchSnapshot()
  })
})
