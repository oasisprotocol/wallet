import { render } from '@testing-library/react'
import * as React from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { createMemoryHistory } from 'history'
import { configureAppStore } from 'store/configureStore'

import { AccountPage } from '..'
import { ConnectedRouter } from 'connected-react-router'

const renderPage = (store, history) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <ConnectedRouter history={history}>
          <AccountPage />
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>,
  )

describe('<AccountPage  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it.skip('should match snapshot', () => {
    const history = createMemoryHistory()
    history.push('/account/account_address')
    const page = renderPage(store, history)
    expect(page.container.firstChild).toMatchSnapshot()
  })
})
