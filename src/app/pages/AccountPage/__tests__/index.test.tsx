import { render } from '@testing-library/react'
import * as React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { createMemoryHistory } from 'history'
import { configureAppStore } from 'store/configureStore'

import { AccountPage } from '..'

const renderPage = (store: any, history: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter>
          <AccountPage />
        </MemoryRouter>
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
