import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.contacts || initialState

export const selectContactsList = createSelector([selectSlice], contacts => Object.values(contacts))
export const selectContact = (address: string) =>
  createSelector([selectContactsList], contacts => contacts.find(contact => contact.address === address))
