import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'
import { accountsPerPage } from './saga'

const selectSlice = (state: RootState) => state.importAccounts || initialState

export const selectError = createSelector([selectSlice], state => state.error)
export const selectImportAccounts = createSelector([selectSlice], state => state)
export const selectImportAccountsFullList = createSelector([selectSlice], state => state.accounts)
export const selectShowAccountsSelectionModal = createSelector(
  [selectSlice],
  state => state.showAccountsSelectionModal,
)
export const selectImportAccountsPageNumber = createSelector(
  [selectSlice],
  state => state.accountsSelectionPageNumber,
)
export const selectImportAccountsOnCurrentPage = createSelector(
  [selectImportAccountsFullList, selectImportAccountsPageNumber],
  (fullList, pageNumber) => fullList.slice(pageNumber * accountsPerPage, (pageNumber + 1) * accountsPerPage),
)
export const selectImportAccountHasMissingBalances = createSelector(
  [selectImportAccountsOnCurrentPage],
  list => list.some(a => !a.balance),
)
export const selectSelectedAccounts = createSelector([selectImportAccountsFullList], state =>
  state.filter(a => a.selected),
)
export const selectBleDevices = createSelector([selectSlice], state => state.bleDevices)
export const selectSelectedBleDevice = createSelector([selectSlice], state => state.selectedBleDevice)
export const selectImportAccountsStep = createSelector([selectSlice], state => state.step)
export const selectShowBleLedgerDevicesModal = createSelector(
  [selectSlice],
  state => state.showBleLedgerDevicesModal,
)
