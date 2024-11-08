import { createWrapStore } from 'webext-redux'
import { configureAppStore } from 'store/configureStore'

const wrapStore = createWrapStore()
const store = configureAppStore()

wrapStore(store)
