import { parseNumberToBigInt, parseStringValueToInt } from './helpers'

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
