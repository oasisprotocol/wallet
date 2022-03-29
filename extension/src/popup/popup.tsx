import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { configureAppStore } from 'store/configureStore'
import { App } from 'app'

import 'locales/i18n'
import 'sanitize.css/sanitize.css'
import 'styles/main.css'

const store = configureAppStore()
const MOUNT_NODE = document.getElementById('root') as HTMLElement

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <HelmetProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </HelmetProvider>
    </ThemeProvider>
  </Provider>,
  MOUNT_NODE,
)

console.log('popup')
