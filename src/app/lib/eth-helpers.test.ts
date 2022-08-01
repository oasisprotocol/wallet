import { isValidPrivateKey, privateToHexAddress, privateToHexPublic } from './eth-helpers'

describe('isValidPrivateKey', () => {
  it('should validate private key', () => {
    expect(isValidPrivateKey('1111111111111111111111111111111111111111111111111111111111111111')).toEqual(
      true,
    )
  })
})

describe('privateToHexPublic', () => {
  it('should get public key', () => {
    expect(privateToHexPublic('1111111111111111111111111111111111111111111111111111111111111111')).toEqual(
      '4f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa385b6b1b8ead809ca67454d9683fcf2ba03456d6fe2c4abe2b07f0fbdbb2f1c1',
    )
  })
})

describe('privateToHexAddress', () => {
  it('should get public address', () => {
    expect(privateToHexAddress('1111111111111111111111111111111111111111111111111111111111111111')).toEqual(
      '0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A',
    )
  })
})
