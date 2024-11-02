import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { configureAppStore } from 'store/configureStore'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { ThemeProvider } from 'styles/theme/ThemeProvider'
import browser from 'webextension-polyfill'

import 'locales/i18n'
import 'sanitize.css/sanitize.css'
import 'styles/main.css'
import { routes } from './routes'

// Open as a single popup:
// - single: so no need to sync between tabs
if (browser.extension.getViews({ type: 'tab' }).length > 0) {
  console.log('This is a tab. Close.')
  window.close()
} else {
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
}
