import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { Profile } from '../'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Profile />
      </ThemeProvider>
    </Provider>,
  )

describe('<Profile  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should render unavailable state', () => {
    const { container } = renderComponent(store)
    expect(container.firstChild).toMatchSnapshot()
  })
})
