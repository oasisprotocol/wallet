import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { ProfileState } from './types'

export const initialState: ProfileState = {
  profileModalOpen: false,
}

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileModalOpen(state, action: PayloadAction<boolean>) {
      state.profileModalOpen = action.payload
    },
  },
})

export const { actions: profileActions } = slice

export default slice.reducer
