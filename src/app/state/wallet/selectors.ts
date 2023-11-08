import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.wallet || initialState
export const selectActiveWallet = createSelector([selectSlice], state => {
  if (state.selectedWallet == null) {
    return undefined
  } else {
    return state.wallets[state.selectedWallet]
  }
})

export const selectWallets = createSelector([selectSlice], state => state.wallets ?? {})
export const selectAddress = createSelector([selectActiveWallet], wallet => wallet?.address)
export const selectWalletsAddresses = createSelector([selectWallets], wallets =>
  Object.values(wallets).map(w => w.address),
)
export const selectPublicKey = createSelector([selectActiveWallet], wallet => wallet?.publicKey ?? '')
export const selectBalance = createSelector([selectActiveWallet], wallet => wallet?.balance)
export const selectType = createSelector([selectActiveWallet], wallet => wallet?.type)
export const selectHasAccounts = createSelector([selectWallets], wallets => Object.keys(wallets).length > 0)
export const selectHasOneAccount = createSelector(
  [selectWallets],
  wallets => Object.keys(wallets).length === 1,
)
