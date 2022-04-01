/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

// Use consistent styling
import 'sanitize.css/sanitize.css'
import { BrowserRouter } from 'react-router-dom'

import { App } from 'app'

import { HelmetProvider } from 'react-helmet-async'

import { configureAppStore } from 'store/configureStore'

import { ThemeProvider } from 'styles/theme/ThemeProvider'

import reportWebVitals from 'reportWebVitals'

// Initialize languages
import './locales/i18n'

// Fonts
import './styles/main.css'

const store = configureAppStore()
const MOUNT_NODE = document.getElementById('root') as HTMLElement

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <HelmetProvider>
        <BrowserRouter>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  </Provider>,
  MOUNT_NODE,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
