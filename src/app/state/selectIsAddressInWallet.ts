import { createSelector } from '@reduxjs/toolkit'
import { selectAccountAddress } from 'app/state/account/selectors'
import { selectAddress, selectIsOpen } from 'app/state/wallet/selectors'

export const selectIsAddressInWallet = createSelector(
  [selectIsOpen, selectAddress, selectAccountAddress],
  (walletIsOpen, walletAddress, address) => walletIsOpen && walletAddress === address,
)
