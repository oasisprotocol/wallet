import { parseNumberToBigInt } from './helpers'

describe('parseNumberToBigInt', () => {
  it('should return a value of type bigint', () => {
    expect(parseNumberToBigInt(33333.3)).toEqual(33333_300_000_000n)
    expect(parseNumberToBigInt(2.0121)).toEqual(2_012_100_000n)
    expect(parseNumberToBigInt(5)).toEqual(5_000_000_000n)
  })
})
