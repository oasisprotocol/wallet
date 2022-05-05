// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect'

import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import 'portable-fetch'

import 'jest-styled-components'

// Init i18n for the tests needing it
import 'locales/i18n'

require('dotenv').config()

global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder
window.TextDecoder = global.TextDecoder
window.TextEncoder = global.TextEncoder

global.fetch = require('portable-fetch')
window.fetch = require('portable-fetch')

global.window.scrollTo = () => {}
