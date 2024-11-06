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

// Only allow one popup/tab with redux, so no need to sync state.
if (browser.extension.getViews({ type: 'tab' }).length > 0) {
  // Either this is a tab, or something else is.
  // If this is a tab, just close.
  // If something else is a tab, it must be ExtensionRequestLedgerPermissionPopup. Focus that and close self.
  ;(async () => {
    // Unexpected: persistent popup is classified as 'TAB' in contexts API
    const tabsAndPersistentPopups = await browser.runtime.getContexts({ contextTypes: ['TAB'] })
    for (const c of tabsAndPersistentPopups) {
      await browser.windows.update(c.windowId, { focused: true })
      await browser.tabs.update(c.tabId, { active: true })
    }
    window.close()
  })()
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
