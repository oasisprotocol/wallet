// eslint-disable-next-line no-restricted-imports
import { createSlice as createSliceOriginal } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

describe('type-only test', () => {
  describe('utils/@reduxjs/toolkit is strictly typed', () => {
    it('correct usage', () => {
      expect(
        createSlice({
          name: 'account',
          initialState: {},
          reducers: {},
        }),
      ).toBeDefined()
    })

    it('detect mistakes', () => {
      expect(
        createSlice({
          // @ts-expect-error Expect typescript to detect incorrect name
          name: 'does_not_exist_in_RootState',
          initialState: {},
          reducers: {},
        }),
      ).toBeDefined()
    })

    it('original createSlice is not strict', () => {
      expect(
        createSliceOriginal({
          name: 'does_not_exist_in_RootState',
          initialState: {},
          reducers: {},
        }),
      ).toBeDefined()
    })
  })
})
