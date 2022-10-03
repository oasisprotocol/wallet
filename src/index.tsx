/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

// Use consistent styling
import 'sanitize.css/sanitize.css'
import { BrowserRouter } from 'react-router-dom'

import { App } from 'app'

import { HelmetProvider } from 'react-helmet-async'

import { configureAppStore } from 'store/configureStore'

import { ThemeProvider } from 'styles/theme/ThemeProvider'

// Initialize languages
import './locales/i18n'

// Fonts
import './styles/main.css'

const store = configureAppStore()
const container = document.getElementById('root') as HTMLElement
const root = createRoot(container!)

root.render(
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
)
