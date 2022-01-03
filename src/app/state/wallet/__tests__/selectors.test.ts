import { selectAvailableBalanceStringValue } from '../selectors'

const mockedSelectBalance = {
  available: '2012100000',
  debonding: '0',
  escrow: '0',
  total: '0',
}

test('selectAvailableBalanceStringValue', () => {
  expect(selectAvailableBalanceStringValue.resultFunc(mockedSelectBalance)).toEqual('2.0121')
})
