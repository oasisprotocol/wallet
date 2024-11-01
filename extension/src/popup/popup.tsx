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

// Open as a single persistent popup:
// - single: so no need to sync between tabs
// - persistent popup: so it doesn't constantly close like popup, and lose unlocked state
;(async () => {
  // Unexpected: persistent popup is classified as 'TAB' in contexts API
  const singlePersistentPopupId = (await browser.runtime.getContexts({ contextTypes: ['TAB'] }))[0]?.windowId
  const isTabOrPopup = (await browser.tabs.getCurrent()) ? 'tab' : 'popup'
  if (isTabOrPopup === 'popup') {
    if (singlePersistentPopupId) {
      console.log('Focus existing persistent popup.')
      await browser.windows.update(singlePersistentPopupId, { focused: true })
      window.close()
    } else {
      console.log('Open new persistent popup.')
      // Add slight delay so `window.screenLeft` returns popup's position, not extension's icon position
      await new Promise(r => setTimeout(r, 100))
      const position = {
        left: window.screenLeft,
        top: window.screenTop + 30,
        width: 400,
        height: 600,
      }
      const newPopup = await browser.windows.create({
        url: window.location.href,
        type: 'popup',
        left: Math.max(Math.min(position.left, window.screen.width - position.width), 0),
        top: Math.max(Math.min(position.top, window.screen.height - position.height), 0),
        width: position.width,
        height: position.height,
        focused: true,
      })
      await browser.windows.update(newPopup.id!, { focused: true }) // Focus again. Helps in rare cases like when screensharing.
      window.close()
    }
  } else if (browser.extension.getViews({ type: 'tab' }).length > 1) {
    console.log('This is a second tab. Close and focus first one.')
    await browser.windows.update(singlePersistentPopupId, { focused: true })
    window.close()
  } else {
    console.log('This is the single persistent popup.')
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
