import { render } from '@testing-library/react'
import { Layer } from 'grommet'
import * as React from 'react'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

const renderComponent = store =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Layer />
      </ThemeProvider>
    </Provider>,
  )

describe('<Layer />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })
  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.container.firstChild).toMatchSnapshot()
  })
})
