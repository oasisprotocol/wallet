import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.ledger || initialState

export const selectError = createSelector([selectSlice], state => state.error)
export const selectLedger = createSelector([selectSlice], state => state)
export const selectDerivationPathType = createSelector([selectSlice], state => state.derivationPathType)
export const selectLedgerAccounts = createSelector([selectSlice], state => state.accounts)
export const selectSelectedLedgerAccounts = createSelector([selectLedgerAccounts], state =>
  state.filter(a => a.selected),
)
