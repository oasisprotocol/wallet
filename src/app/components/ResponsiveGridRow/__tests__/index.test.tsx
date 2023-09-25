import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { ResponsiveGridRow, ResponsiveGridAddressRow } from '..'

describe('<ResponsiveGridRow />', () => {
  it('should render component', () => {
    const { container } = render(<ResponsiveGridRow label="Type" value="transfer" />)

    expect(container).toMatchSnapshot()
  })
})

const address = 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4'
const renderComponent = (store: any, address: string) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <ResponsiveGridAddressRow label="To" value={address} />
      </ThemeProvider>
    </Provider>,
  )

describe('<ResponsiveGridAddressRow  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({
      contacts: {
        [address]: {
          address: address,
          name: 'My Contact',
        },
      },
    })
  })

  it('should match snapshot', () => {
    const { container } = renderComponent(store, address)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should render without a name', () => {
    renderComponent(store, 'oasis1qqurxkgavtcjjytneumeclx59ds3avjaqg7ftqph')
    expect(screen.queryByText('My Contact')).not.toBeInTheDocument()
  })
})
