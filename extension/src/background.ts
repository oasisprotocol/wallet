import '../../src/polyfill'
import { wrapStore } from 'webext-redux'
import { configureAppStore } from 'store/configureStore'

const store = configureAppStore()

wrapStore(store)
