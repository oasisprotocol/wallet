import { configureAppStore } from '../configureStore'
import { password, privateKeyPersistedState } from '../../../playwright/utils/test-inputs'
import { persistActions } from '../../app/state/persist'
jest.mock('@oasisprotocol/client/dist/client')

describe('persisted-state migration', () => {
  let jsdomCrypto: any
  beforeEach(() => {
    jsdomCrypto = global.crypto
    Object.defineProperty(global, 'crypto', { value: require('crypto') })
    window.localStorage.setItem('oasis_wallet_persist_v1', privateKeyPersistedState)
  })

  afterEach(() => {
    Object.defineProperty(global, 'crypto', { value: jsdomCrypto })
    window.localStorage.removeItem('oasis_wallet_persist_v1')
  })

  it('should define app reducers', async () => {
    expect(global.crypto.subtle.importKey).toBeDefined()
    const store = configureAppStore()
    store.dispatch(persistActions.unlockAsync({ password }))
    await new Promise(r => setTimeout(r, 1000))
    console.log(store.getState())

    // is decrypted but has fatal: TypeError: unexpected type, use Uint8Array
  })
})
