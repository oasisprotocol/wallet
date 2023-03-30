import { misc, staking } from '@oasisprotocol/client'
import { paraTimesConfig } from './config'

describe('paraTimesConfig', () => {
  it('addresses should be derived from runtimeId', async () => {
    for (const paraTimeConfig of Object.values(paraTimesConfig)) {
      for (const paraTimeNetwork of [paraTimeConfig.mainnet, paraTimeConfig.testnet]) {
        if (paraTimeNetwork.runtimeId) {
          const address = await staking.addressFromRuntimeID(misc.fromHex(paraTimeNetwork.runtimeId))
          expect(staking.addressToBech32(address).toLowerCase()).toEqual(paraTimeNetwork.address)
        }
      }
    }
  })
})
