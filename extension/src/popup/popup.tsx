import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Store } from 'webext-redux'
import { HashRouter } from 'react-router-dom'

import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { App } from 'app'

import 'locales/i18n'
import 'sanitize.css/sanitize.css'
import 'styles/main.css'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container!)
const store = new Store()

store.ready().then(() => {
  root.render(
    <Provider store={store}>
      <ThemeProvider>
        <HelmetProvider>
          <HashRouter>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </HashRouter>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>,
  )
})

console.log('popup')
