import 'react-app-polyfill/stable'

import * as React from 'react'
import { createRoot } from 'react-dom/client'

// Use consistent styling
import 'sanitize.css/sanitize.css'

import { ThemeProviderWithoutRedux } from 'styles/theme/ThemeProvider'

// Initialize languages
import 'locales/i18n'

// Fonts
import 'styles/main.css'
import { ExtensionRequestLedgerPermissionPopup } from './ExtensionRequestLedgerPermissionPopup'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container!)

root.render(
  // Avoid redux: it's not necessary and has it has a little potential to cause
  // conflicts in stored state because it runs in parallel with wallet popup.
  <ThemeProviderWithoutRedux>
    <React.StrictMode>
      <ExtensionRequestLedgerPermissionPopup />
    </React.StrictMode>
  </ThemeProviderWithoutRedux>,
)
