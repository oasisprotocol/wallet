import { isValidAddress } from '../../lib/helpers'
import { WalletError, WalletErrors } from 'types/errors'

export interface AccountPageParams {
  address: string
}

export function validateAccountPageRoute(params: AccountPageParams) {
  const isValid = isValidAddress(params.address)
  if (!isValid) {
    throw new WalletError(WalletErrors.InvalidAddress, 'Invalid address')
  }

  return isValid
}
