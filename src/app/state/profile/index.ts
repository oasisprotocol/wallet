import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { ProfileState } from './types'

export const initialState: ProfileState = {
  // Overlay layer with manage account view
  manageAccountModalId: '',
  // Main profile modal
  profileModalOpen: false,
}

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setManageAccountModalId(state, action: PayloadAction<string>) {
      state.profileModalOpen = true
      state.manageAccountModalId = action.payload
    },
    setProfileModalOpen(state, action: PayloadAction<boolean>) {
      state.profileModalOpen = action.payload
    },
  },
})

export const { actions: profileActions } = slice

export default slice.reducer
