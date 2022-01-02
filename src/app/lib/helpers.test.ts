import { parseNumberToBigInt, parseBigIntToString } from './helpers'

describe('parseNumberToBigInt', () => {
  it('should return a value of type bigint', () => {
    expect(parseNumberToBigInt(33333.3)).toEqual(33333_300_000_000n)
    expect(parseNumberToBigInt(2.0121)).toEqual(2_012_100_000n)
    expect(parseNumberToBigInt(5)).toEqual(5_000_000_000n)
  })
})

describe('parseBigIntToString', () => {
  it('should transform a string representation of bigint into readable string', () => {
    expect(parseBigIntToString('399739480000000')).toEqual('399739.48')
    expect(parseBigIntToString('5000000000')).toEqual('5')
  })
})
