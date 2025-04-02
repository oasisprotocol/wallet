import { test, expect } from '@playwright/test'
import { E2EWindow } from '../../src/app/pages/E2EPage/E2EWindow'

for (const net of ['mainnet', 'testnet']) {
  test(`Check if hardcoded consensus fee needs to be updated (setFeeAmount(oasis.quantity.fromBigInt(0n))) : ${net}`, async ({
    page,
  }) => {
    await page.goto('/e2e')

    const estimatedGas = await page.evaluate(
      async ([net]) => {
        const { oasis } = window as E2EWindow

        const nic =
          net === 'mainnet'
            ? new oasis.client.NodeInternal('https://grpc.oasis.io')
            : new oasis.client.NodeInternal('https://testnet.grpc.oasis.io')

        const minPrice = await nic.consensusMinGasPrice()
        return oasis.quantity.toBigInt(minPrice).toString()
      },
      [net] as const,
    )

    expect(estimatedGas).toBe('0')
  })
}
