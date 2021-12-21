import { parseNumberToBigInt } from './helpers'

describe('parseNumberToBigInt', () => {
  it('should return a value of type bigint', () => {
    expect(parseNumberToBigInt(33333.3)).toEqual(33333300000000n)
    expect(parseNumberToBigInt(2.0121)).toEqual(2012100000n)
    expect(parseNumberToBigInt(5)).toEqual(5000000000n)
  })
})
