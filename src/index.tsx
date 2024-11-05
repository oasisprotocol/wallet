/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/stable'

import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

// Use consistent styling
import 'sanitize.css/sanitize.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { HelmetProvider } from 'react-helmet-async'

import { configureAppStore } from 'store/configureStore'

import { ThemeProvider } from 'styles/theme/ThemeProvider'

// Initialize languages
import 'locales/i18n'

// Fonts
import 'styles/main.css'
import { routes } from './routes'

const store = configureAppStore()
const container = document.getElementById('root') as HTMLElement
const root = createRoot(container!)
const router = createBrowserRouter(routes)

root.render(
  <Provider store={store}>
    <ThemeProvider>
      <HelmetProvider>
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </HelmetProvider>
    </ThemeProvider>
  </Provider>,
)
