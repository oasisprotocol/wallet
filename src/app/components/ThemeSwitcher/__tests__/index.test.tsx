import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { ThemeSelect } from '../'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <ThemeSelect />
      </ThemeProvider>
    </Provider>,
  )

describe('<ThemeSelect  />', () => {
  let store: ReturnType<typeof configureAppStore>

  it('should match snapshot', () => {
    store = configureAppStore({
      theme: {
        selected: 'light',
      },
    })
    const { container } = renderComponent(store)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should render dark variant', () => {
    store = configureAppStore({
      theme: {
        selected: 'dark',
      },
    })
    renderComponent(store)
    expect(screen.getByLabelText('Moon')).toBeInTheDocument() // dark theme icon
    expect(screen.getByLabelText(/Selected: dark/)).toBeInTheDocument()
    expect(screen.getByDisplayValue('theme.darkMode')).toBeInTheDocument()
  })
})
