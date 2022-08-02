import {
  parseNumberToBigInt,
  parseStringValueToInt,
  parseRoseStringToBaseUnitString,
  base64ToUint,
  shortPublicKey,
  publicKeyToAddress,
  addressToPublicKey,
  isValidAddress,
  parseRpcBalance,
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

  it('should parse without losing precision', () => {
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect(parseStringValueToInt('1563114365108.133939632')).toEqual(1563114365108133939632)
  })
})

describe('parseRoseStringToBaseUnitString', () => {
  it('should parse stringified number of ROSEs to stringified base units', () => {
    expect(parseRoseStringToBaseUnitString('9143.65')).toEqual('9143650000000')
    expect(parseRoseStringToBaseUnitString('5')).toEqual('5000000000')
  })
  it('should parse without losing precision', () => {
    expect(parseRoseStringToBaseUnitString('1563114365108.133939632')).toEqual('1563114365108133939632')
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

  it('isValidAddress', () => {
    expect(isValidAddress(address)).toEqual(true)

    expect(isValidAddress(address.slice(0, -1))).toEqual(false)
    expect(isValidAddress(address.slice(0, -1) + 'f')).toEqual(false)

    const validBechBTC = 'bc1q9swhsc6qpd309scrzwzhgs2jd56xtxvjuxwx4c'
    expect(isValidAddress(validBechBTC)).toEqual(false)
  })
})

describe('parseRpcBalance', () => {
  it('normal account', () => {
    expect(
      parseRpcBalance({
        general: {
          nonce: 6,
          balance: new Uint8Array([4, 156, 44, 5, 255]),
          allowances: new Map([
            [
              new Uint8Array([
                0, 231, 194, 146, 238, 23, 67, 225, 130, 250, 91, 112, 220, 4, 79, 18, 79, 171, 186, 228, 198,
              ]),
              new Uint8Array([59, 154, 202, 0]),
            ],
          ]),
        },
      }),
    ).toEqual({
      available: '19799999999',
      validator: {
        escrow: '0',
        escrow_debonding: '0',
      },
    })
  })

  it('validator account', () => {
    expect(
      parseRpcBalance({
        escrow: {
          active: {
            balance: new Uint8Array([3, 83, 246, 133, 201, 58, 236, 66]),
            total_shares: new Uint8Array([2, 186, 5, 225, 168, 230, 50, 231]),
          },
          debonding: {
            balance: new Uint8Array([119, 83, 91, 169, 228, 206]),
            total_shares: new Uint8Array([119, 83, 91, 169, 228, 206]),
          },
          commission_schedule: {},
          stake_accumulator: {},
        },
        general: {
          nonce: 18,
          balance: new Uint8Array([10, 111, 221, 122, 100, 106]),
        },
      }),
    ).toEqual({
      available: '11475573433450',
      validator: {
        escrow: '239806259647933506',
        escrow_debonding: '131199903851726',
      },
    })
  })
})
