import { test, expect } from '@playwright/test'
import { paraTimesConfig } from '../../src/config'
import { E2EWindow } from '../../src/app/pages/E2EPage/E2EWindow'

for (const net of ['mainnet', 'testnet']) {
  for (const paratime of ['sapphire', 'emerald', 'cipher']) {
    test(`Check if hardcoded Paratime withdraw gas limit needs to be updated: ${net} ${paratime}`, async ({
      page,
    }) => {
      await page.goto('/e2e')

      const estimatedGas = await page.evaluate(
        async ([net, paratime, paraTimesConfig]) => {
          const { oasis, oasisRT } = window as E2EWindow

          const nic =
            net === 'mainnet'
              ? new oasis.client.NodeInternal('https://grpc.oasis.io')
              : new oasis.client.NodeInternal('https://testnet.grpc.oasis.io')

          const txWrapper = new oasisRT.consensusAccounts.Wrapper(
            oasis.misc.fromHex(paraTimesConfig[paratime][net].runtimeId!),
          )
            .callDeposit()
            .setBody({
              amount: [
                oasis.quantity.fromBigInt(10n ** 18n * 1000000000n),
                oasisRT.token.NATIVE_DENOMINATION,
              ],
              to: oasis.staking.addressFromBech32(
                // await getEvmBech32Address('0x0000000000000000000000000000000000000000')
                'oasis1qq2v39p9fqk997vk6742axrzqyu9v2ncyuqt8uek',
              ),
            })
            .setFeeAmount([oasis.quantity.fromBigInt(10n ** 18n), oasisRT.token.NATIVE_DENOMINATION])
            .setFeeGas(10n ** 18n)
            .setFeeConsensusMessages(1)
            .setSignerInfo([
              {
                address_spec: {
                  signature: {
                    ed25519: oasis.signature.NaclSigner.fromRandom('this key is not important').public(),
                  },
                },
                nonce: 10000n,
              },
            ])

          const estimatedGas = await new oasisRT.core.Wrapper(
            oasis.misc.fromHex(paraTimesConfig[paratime][net].runtimeId!),
          )
            .queryEstimateGas()
            .setArgs({ tx: txWrapper.transaction })
            .query(nic)

          return estimatedGas
        },
        [net, paratime, paraTimesConfig] as const,
      )

      expect(estimatedGas.toString()).toMatchSnapshot()
      expect(estimatedGas).toBeLessThan(paraTimesConfig[paratime].feeGas)
    })
  }
}
