import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { ContactsState, Contact } from './types'

export const initialState: ContactsState = {}

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    add(state, action: PayloadAction<Contact>) {
      state[action.payload.address] = action.payload
    },
    update(state, action: PayloadAction<Contact>) {
      state[action.payload.address] = action.payload
    },
    delete(state, action: PayloadAction<string>) {
      delete state[action.payload]
    },
  },
})

export const { actions: contactsActions } = contactsSlice
