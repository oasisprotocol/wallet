import { render, screen, waitFor } from '@testing-library/react'
import { fatalErrorActions } from 'app/state/fatalerror'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'

import { FatalErrorHandler } from '..'

const renderComponent = store =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <FatalErrorHandler />
      </ThemeProvider>
    </Provider>,
  )

describe('<FatalErrorHandler />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should be null without an error', () => {
    const component = renderComponent(store)
    expect(component.container.firstChild).toMatchSnapshot()
    expect(component.container.firstChild!.firstChild).toBeNull()
  })

  it('should display the error', async () => {
    renderComponent(store)
    store.dispatch(fatalErrorActions.setError({ message: 'dummy-message' }))

    await waitFor(() => expect(screen.queryByTestId('fatalerror-message')).toContainHTML('dummy-message'))
  })
})
