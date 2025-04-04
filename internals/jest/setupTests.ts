import { waitFor } from '@testing-library/react'
import 'dotenv/config'

// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom'
import 'jest-styled-components' // Snapshot serializer

// Init i18n for the tests needing it
import 'locales/i18n'

process.env.REACT_APP_LOCALNET = '1'

global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder
window.TextDecoder = global.TextDecoder
window.TextEncoder = global.TextEncoder

global.window.scrollTo = () => {}

afterEach(async () => {
  // @testing-library/react does not directly cleanup portals, but it does
  // trigger their internal cleanup. Wait for closing animation to finish.
  await waitFor(() => {
    expect(document.querySelector('[data-g-portal-id]')).not.toBeInTheDocument()
  })
})
