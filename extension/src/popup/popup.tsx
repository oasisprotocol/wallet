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

// Open as a single tab:
// - single: so no need to sync between tabs
// - tab: so it doesn't constantly close like popup, and lose unlocked state
;(async () => {
  const singleTabId = (await browser.runtime.getContexts({ contextTypes: ['TAB'] }))[0]?.tabId
  const isTabOrPopup = (await browser.tabs.getCurrent()) ? 'tab' : 'popup'
  if (isTabOrPopup === 'popup') {
    if (singleTabId) {
      console.log('Focus existing tab and close popup.')
      await browser.tabs.update(singleTabId, { active: true })
      window.close()
    } else {
      console.log('Open new tab and close popup.')
      await browser.tabs.create({ url: window.location.href })
      window.close()
    }
  } else if (browser.extension.getViews({ type: 'tab' }).length > 1) {
    console.log('This is a second tab. Close and focus first one.')
    await browser.tabs.update(singleTabId, { active: true })
    window.close()
  } else {
    console.log('This is the single tab.')
    await browser.action.setBadgeText({ text: '🗔' })
    window.addEventListener('beforeunload', () => {
      browser.action.setBadgeText({ text: null })
    })

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
})()
