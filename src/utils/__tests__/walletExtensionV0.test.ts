import { password, walletExtensionV0PersistedState, wrongPassword } from '../__fixtures__/test-inputs'
import { decryptWithPasswordV0 } from '../walletExtensionV0'

let jsdomCrypto: any
beforeEach(() => {
  jsdomCrypto = global.crypto
  Object.defineProperty(global, 'crypto', { value: require('crypto') })
})

afterEach(() => {
  Object.defineProperty(global, 'crypto', { value: jsdomCrypto })
})

test('decryptWithPasswordV0', async () => {
  const migratedV0Fixture = await decryptWithPasswordV0(password, walletExtensionV0PersistedState)
  expect(migratedV0Fixture).toMatchSnapshot()

  await expect(decryptWithPasswordV0(wrongPassword, walletExtensionV0PersistedState)).rejects.toThrow(
    'Password wrong',
  )
})
