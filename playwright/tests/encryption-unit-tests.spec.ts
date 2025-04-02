import { test, expect } from '@playwright/test'
import { EncryptedObject } from '../../src/app/state/persist/types'
import { E2EWindow } from '../../src/app/pages/E2EPage/E2EWindow'

test.beforeEach(async ({ page }) => {
  await page.goto('/e2e')
})

test.describe('encryption unit tests in browser', () => {
  const PASSWORD = 'abcd1234&'
  const DATA = { acc: [1, 2, 3] }

  test('deriveKeyFromPassword should randomize salt by default', async ({ page }) => {
    const { derivedKeyWithSalt1, derivedKeyWithSalt2 } = await page.evaluate(
      async ([PASSWORD]) => {
        const { deriveKeyFromPassword } = (window as E2EWindow).encryption
        const derivedKeyWithSalt1 = await deriveKeyFromPassword(PASSWORD)
        const derivedKeyWithSalt2 = await deriveKeyFromPassword(PASSWORD)
        return { derivedKeyWithSalt1, derivedKeyWithSalt2 }
      },
      [PASSWORD] as const,
    )
    expect(derivedKeyWithSalt1.salt).not.toEqual(derivedKeyWithSalt2.salt)
    expect(derivedKeyWithSalt1.key).not.toEqual(derivedKeyWithSalt2.key)
  })

  test('encryptWithKey should randomize nonce every time', async ({ page }) => {
    const { encryptedString1, encryptedString2 } = await page.evaluate(
      async ([PASSWORD, DATA]) => {
        const { deriveKeyFromPassword, encryptWithKey } = (window as E2EWindow).encryption
        const derivedKeyWithSalt = await deriveKeyFromPassword(PASSWORD)
        const encryptedString1 = await encryptWithKey(derivedKeyWithSalt, DATA)
        const encryptedString2 = await encryptWithKey(derivedKeyWithSalt, DATA)
        return { encryptedString1, encryptedString2 }
      },
      [PASSWORD, DATA] as const,
    )
    expect(encryptedString1).not.toEqual(encryptedString2)
  })

  test('roundtrip', async ({ page }) => {
    const { dataDecrypted } = await page.evaluate(
      async ([PASSWORD, DATA]) => {
        const { deriveKeyFromPassword, encryptWithKey, decryptWithPassword } = (window as E2EWindow)
          .encryption
        const derivedKeyWithSalt = await deriveKeyFromPassword(PASSWORD)
        const encryptedString = await encryptWithKey(derivedKeyWithSalt, DATA)
        const dataDecrypted = await decryptWithPassword<typeof DATA>(PASSWORD, encryptedString)
        return { dataDecrypted }
      },
      [PASSWORD, DATA] as const,
    )
    expect(dataDecrypted).toEqual(DATA)
  })

  test('fromBase64andParse', async ({ page }) => {
    const { parsed, decrypted } = await page.evaluate(
      async ([PASSWORD]) => {
        const { fromBase64andParse, decryptWithPassword } = (window as E2EWindow).encryption
        const encryptedString = `{
        "secretbox":{"$Uint8Array$":"OUmZsaPRcDoqLP7v4rScl6RCjNTvimf8tPQiW/Bb8A=="},
        "nonce":{"$Uint8Array$":"v3Mgk2IDN+GiE6/inm4pPkRFxlNURvmf"},
        "salt":{"$Uint8Array$":"jlQBIps/9qrGEP1XO4yl0UZ7ND/RT4kSdHsbVpndziI="}
      }`
        const parsed = JSON.stringify(fromBase64andParse(encryptedString), null, 2)
        const decrypted = await decryptWithPassword<typeof DATA>(PASSWORD, encryptedString as any)
        return { parsed, decrypted }
      },
      [PASSWORD] as const,
    )

    expect(parsed).toEqual(
      JSON.stringify(
        {
          secretbox: new Uint8Array([
            57, 73, 153, 177, 163, 209, 112, 58, 42, 44, 254, 239, 226, 180, 156, 151, 164, 66, 140, 212, 239,
            138, 103, 252, 180, 244, 34, 91, 240, 91, 240,
          ]),
          nonce: new Uint8Array([
            191, 115, 32, 147, 98, 3, 55, 225, 162, 19, 175, 226, 158, 110, 41, 62, 68, 69, 198, 83, 84, 70,
            249, 159,
          ]),
          salt: new Uint8Array([
            142, 84, 1, 34, 155, 63, 246, 170, 198, 16, 253, 87, 59, 140, 165, 209, 70, 123, 52, 63, 209, 79,
            137, 18, 116, 123, 27, 86, 153, 221, 206, 34,
          ]),
        } satisfies EncryptedObject,
        null,
        2,
      ),
    )
    expect(decrypted).toEqual(DATA)
  })
})
