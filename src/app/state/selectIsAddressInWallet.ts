import { createSelector } from '@reduxjs/toolkit'
import { selectAccountAddress } from 'app/state/account/selectors'
import { selectAddress, selectHasAccounts } from 'app/state/wallet/selectors'

export const selectIsAddressInWallet = createSelector(
  [selectHasAccounts, selectAddress, selectAccountAddress],
  (hasAccounts, walletAddress, address) => hasAccounts && walletAddress === address,
)
