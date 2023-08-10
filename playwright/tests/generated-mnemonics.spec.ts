import { test, expect } from '@playwright/test'

// Prevent https://blog.ledger.com/Funds-of-every-wallet-created-with-the-Trust-Wallet-browser-extension-could-have-been-stolen/
// or https://milksad.info/disclosure.html
test('Generated mnemonics should have more than 32 bits of entropy (thus no collisions in 250_000 rounds)', async ({
  page,
}) => {
  await page.goto('/e2e')

  const numberOfMnemonics = await page.evaluate(async () => {
    const oasis: typeof import('@oasisprotocol/client') = (window as any).oasis
    const generatedMnemonics = new Set(
      [...new Array(250_000)].map(() => oasis.hdkey.HDKey.generateMnemonic(256)),
    )
    return generatedMnemonics.size
  })
  expect(numberOfMnemonics).toBe(250_000)
})
