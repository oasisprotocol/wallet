import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { configureAppStore } from 'store/configureStore'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { ThemeProvider } from 'styles/theme/ThemeProvider'

import 'locales/i18n'
import 'sanitize.css/sanitize.css'
import 'styles/main.css'
import { routes } from './routes'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container!)
const store = configureAppStore()
const router = createHashRouter(routes)

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
