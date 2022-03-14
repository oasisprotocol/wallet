import {
  parseNumberToBigInt,
  parseStringValueToInt,
  base64ToUint,
  shortPublicKey,
  publicKeyToAddress,
  addressToPublicKey,
} from './helpers'

describe('parseNumberToBigInt', () => {
  it('should return a value of type bigint', () => {
    expect(parseNumberToBigInt(33333.3)).toEqual(33333_300_000_000n)
    expect(parseNumberToBigInt(2.0121)).toEqual(2_012_100_000n)
    expect(parseNumberToBigInt(5)).toEqual(5_000_000_000n)
  })
})

describe('parseStringValueToInt', () => {
  it('should return int for a string token value', () => {
    expect(parseStringValueToInt('9143.65')).toEqual(9143_650_000_000)
    expect(parseStringValueToInt('5')).toEqual(5_000_000_000)
  })
})

describe('parsing public key', () => {
  const publicKeyBase64 = 'eZuacXy5s3/nolB/E3gF4vqUYdvfOlVaaBXGfZcGwKc='
  const address = 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe'
  const shortPublicKeyUint = new Uint8Array([
    0, 34, 97, 129, 252, 28, 14, 12, 37, 55, 102, 238, 155, 138, 161, 126, 249, 236, 187, 7, 28,
  ])

  it('shortPublicKey', async () => {
    expect(await shortPublicKey(base64ToUint(publicKeyBase64))).toEqual(shortPublicKeyUint)
  })

  it('publicKeyToAddress', async () => {
    expect(await publicKeyToAddress(base64ToUint(publicKeyBase64))).toEqual(address)
  })

  it('addressToPublicKey', async () => {
    expect(await addressToPublicKey(address)).toEqual(shortPublicKeyUint)
  })
})
