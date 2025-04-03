import { test, expect } from '@playwright/test'
import { E2EWindow } from '../../src/app/pages/E2EPage/E2EWindow'

for (const net of ['mainnet', 'testnet']) {
  test(`Check if hardcoded consensus fee needs to be updated (setFeeAmount(oasis.quantity.fromBigInt(0n))) : ${net}`, async ({
    page,
  }) => {
    await page.goto('/e2e')

    const estimatedGas = await page.evaluate(
      async ([net]) => {
        const { oasis, grpcWeb } = window as E2EWindow

        const nic =
          net === 'mainnet'
            ? new oasis.client.NodeInternal('https://grpc.oasis.io')
            : new oasis.client.NodeInternal('https://testnet.grpc.oasis.io')

        function toCBOR(v) {
          // gRPC cannot handle nil arguments unmarshalled from CBOR, so we use a special case to
          // marshal `nil` to an empty byte string.
          if (v == null) return new Uint8Array()
          return oasis.misc.toCBOR(v)
        }
        function createMethodDescriptorUnary(serviceName, methodName) {
          const MethodType = grpcWeb.MethodType
          return new grpcWeb.MethodDescriptor(
            `/oasis-core.${serviceName}/${methodName}`,
            MethodType.UNARY,
            null as any,
            null as any,
            toCBOR,
            oasis.misc.fromCBOR,
          )
        }
        const methodDescriptorConsensusMinGasPrice = createMethodDescriptorUnary('Consensus', 'MinGasPrice')

        // `const minPrice = await nic.consensusMinGasPrice()` in next version
        const minPrice = await nic['callUnary']<undefined, Uint8Array>(
          methodDescriptorConsensusMinGasPrice,
          undefined,
        )
        return oasis.quantity.toBigInt(minPrice).toString()
      },
      [net] as const,
    )

    expect(estimatedGas).toBe('0')
  })
}
