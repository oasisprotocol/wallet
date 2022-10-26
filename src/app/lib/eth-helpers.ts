import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { addHexPrefix, privateToAddress, toChecksumAddress } from 'ethereumjs-util'
export { isValidAddress as isValidEthAddress } from 'ethereumjs-util'

export const hexToBuffer = (value: string): Buffer => Buffer.from(value, 'hex')
export const privateToEthAddress = (value: string): string =>
  toChecksumAddress(addHexPrefix(privateToAddress(hexToBuffer(value)).toString('hex')))

export async function getEvmBech32Address(evmAddress: string) {
  const evmBytes = oasis.misc.fromHex(evmAddress.replace('0x', ''))
  const address = await oasis.address.fromData(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    evmBytes,
  )
  const bech32Address = oasisRT.address.toBech32(address)
  return bech32Address
}
