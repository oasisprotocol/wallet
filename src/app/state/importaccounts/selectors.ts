import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.importAccounts || initialState

export const selectError = createSelector([selectSlice], state => state.error)
export const selectImportAccounts = createSelector([selectSlice], state => state)
export const selectImportAccountsList = createSelector([selectSlice], state => state.accounts)
export const selectShowAccountsSelectionModal = createSelector(
  [selectSlice],
  state => state.showAccountsSelectionModal,
)
export const selectSelectedAccounts = createSelector([selectImportAccountsList], state =>
  state.filter(a => a.selected),
)
