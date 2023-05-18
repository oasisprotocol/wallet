import { decryptWithPassword, deriveKeyFromPassword, encryptWithKey, fromBase64andParse } from 'app/state/persist/encryption'
import { EncryptedObject } from '../../src/app/state/persist/types'

describe('encryption unit tests in browser', () => {
  const PASSWORD = 'abcd1234&'
  const DATA = { acc: [1, 2, 3] }

  it('deriveKeyFromPassword should randomize salt by default', async () => {
    const derivedKeyWithSalt1 = await deriveKeyFromPassword(PASSWORD)
    const derivedKeyWithSalt2 = await deriveKeyFromPassword(PASSWORD)
    expect(derivedKeyWithSalt1.salt).not.deep.equal(derivedKeyWithSalt2.salt)
    expect(derivedKeyWithSalt1.key).not.deep.equal(derivedKeyWithSalt2.key)
  })

  it('encryptWithKey should randomize nonce every time', async () => {
    const derivedKeyWithSalt = await deriveKeyFromPassword(PASSWORD)
    const encryptedString1 = await encryptWithKey(derivedKeyWithSalt, DATA)
    const encryptedString2 = await encryptWithKey(derivedKeyWithSalt, DATA)
    expect(encryptedString1).not.deep.equal(encryptedString2)
  })

  it('roundtrip', async () => {
    const derivedKeyWithSalt = await deriveKeyFromPassword(PASSWORD)
    const encryptedString = await encryptWithKey(derivedKeyWithSalt, DATA)
    const dataDecrypted = await decryptWithPassword<typeof DATA>(PASSWORD, encryptedString)
    expect(dataDecrypted).deep.equal(DATA)
  })

  it('fromBase64andParse', async () => {
    const encryptedString = `{
      "secretbox":{"$Uint8Array$":"OUmZsaPRcDoqLP7v4rScl6RCjNTvimf8tPQiW/Bb8A=="},
      "nonce":{"$Uint8Array$":"v3Mgk2IDN+GiE6/inm4pPkRFxlNURvmf"},
      "salt":{"$Uint8Array$":"jlQBIps/9qrGEP1XO4yl0UZ7ND/RT4kSdHsbVpndziI="}
    }`

    const parsed = fromBase64andParse(encryptedString)
    expect(parsed).deep.equal({
      secretbox: new Uint8Array([
        57, 73, 153, 177, 163, 209, 112, 58, 42, 44, 254, 239, 226, 180, 156, 151, 164, 66, 140, 212, 239,
        138, 103, 252, 180, 244, 34, 91, 240, 91, 240,
      ]),
      nonce: new Uint8Array([
        191, 115, 32, 147, 98, 3, 55, 225, 162, 19, 175, 226, 158, 110, 41, 62, 68, 69, 198, 83, 84, 70, 249,
        159,
      ]),
      salt: new Uint8Array([
        142, 84, 1, 34, 155, 63, 246, 170, 198, 16, 253, 87, 59, 140, 165, 209, 70, 123, 52, 63, 209, 79, 137,
        18, 116, 123, 27, 86, 153, 221, 206, 34,
      ]),
    } satisfies EncryptedObject)

    const decrypted = await decryptWithPassword<typeof DATA>(PASSWORD, encryptedString)
    expect(decrypted).deep.equal(DATA)
  })
})
