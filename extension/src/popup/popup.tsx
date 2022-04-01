import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Store } from 'webext-redux'
import { HashRouter } from 'react-router-dom'

import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { App } from 'app'

import 'locales/i18n'
import 'sanitize.css/sanitize.css'
import 'styles/main.css'

const MOUNT_NODE = document.getElementById('root') as HTMLElement
const store = new Store()

store.ready().then(() => {
  ReactDOM.render(
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
    MOUNT_NODE,
  )
})

console.log('popup')
