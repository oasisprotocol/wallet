import { selectAvailableBalance } from './selectors'

const mockedSelectBalance = {
  available: '2012100000',
  debonding: '0',
  escrow: '0',
  total: '0',
}

test('selectAvailableBalance', () => {
  expect(selectAvailableBalance.resultFunc(mockedSelectBalance)).toEqual(2.0121)
})
