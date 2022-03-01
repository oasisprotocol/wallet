import { bech32 } from 'bech32'
import { address, quantity } from '@oasisprotocol/client'

export const uint2hex = (uint: Uint8Array) => Buffer.from(uint).toString('hex')
export const hex2uint = (hex: string) => new Uint8Array(Buffer.from(hex, 'hex'))

export const shortPublicKey = async (publicKey: Uint8Array) => {
  return await address.fromData('oasis-core/address: staking', 0, publicKey)
}

export const publicKeyToAddress = async (publicKey: Uint8Array) => {
  const data = await address.fromData('oasis-core/address: staking', 0, publicKey)
  return address.toBech32('oasis', data)
}

export const addressToPublicKey = async (addr: string) => {
  // const data = await address.fromData('oasis-core/address: staking', 0, publicKey)
  return address.fromBech32('oasis', addr)
}

export const uint2bigintString = (uint: Uint8Array) => quantity.toBigInt(uint).toString()
export const stringBigint2uint = (number: string) => quantity.fromBigInt(BigInt(number))

export const isValidAddress = (addr: string) => {
  let valid = false
  try {
    if (!addr.match(/^oasis1/)) {
      throw new Error('Invalid')
    }

    bech32.decode(addr)
    valid = true
  } catch (e) {}

  return valid
}

export function concat(...parts: Uint8Array[]) {
  let length = 0
  for (const part of parts) {
    length += part.length
  }
  let result = new Uint8Array(length)
  let pos = 0
  for (const part of parts) {
    result.set(part, pos)
    pos += part.length
  }
  return result
}

export const parseNumberToBigInt = (value: number) => BigInt(Math.round(value * 10 ** 9))
export const parseStringValueToInt = (value: string) => parseFloat(value) * 10 ** 9
export const parseBigIntStringToInt = (value: string) => Number(value) / 10 ** 9
