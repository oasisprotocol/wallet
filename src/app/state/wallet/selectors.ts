import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.wallet || initialState
export const selectWallet = createSelector([selectSlice], state => state)
export const selectBalance = createSelector([selectWallet], wallet => wallet.balance)
export const selectAddress = createSelector([selectWallet], wallet => wallet.address)
export const selectPublicKey = createSelector([selectWallet], wallet => wallet.publicKey)
export const selectStatus = createSelector([selectWallet], wallet => wallet.isOpen)
export const selectTransactionStatus = createSelector([selectWallet], wallet => wallet.transaction)
