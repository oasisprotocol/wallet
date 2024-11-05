import 'react-app-polyfill/stable'

import * as React from 'react'
import { createRoot } from 'react-dom/client'

// Use consistent styling
import 'sanitize.css/sanitize.css'

import { ThemeProvider } from 'styles/theme/ThemeProvider'

// Initialize languages
import 'locales/i18n'

// Fonts
import 'styles/main.css'
import { ExtensionRequestLedgerPermissionPopup } from './ExtensionRequestLedgerPermissionPopup'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container!)

root.render(
  <ThemeProvider>
    <React.StrictMode>
      <ExtensionRequestLedgerPermissionPopup />
    </React.StrictMode>
  </ThemeProvider>,
)
