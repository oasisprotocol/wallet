import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.createWallet || initialState

export const selectCreateWallet = createSelector([selectSlice], state => state)
export const selectMnemonic = createSelector([selectCreateWallet], wallet => wallet.mnemonic)
export const selectCheckbox = createSelector([selectCreateWallet], wallet => wallet.checkbox)
