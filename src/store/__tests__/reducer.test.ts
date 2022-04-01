import { createReducer } from '../reducers'
import { Reducer } from '@reduxjs/toolkit'

describe('reducer', () => {
  it('should inject reducers', () => {
    const dummyReducer = (s = {}, a: {}) => 'dummyResult'
    const reducer = createReducer({ test: dummyReducer } as any) as Reducer<any, any>
    const state = reducer({}, '')
    expect(state.test).toBe('dummyResult')
  })

  it('should define app reducers', () => {
    const reducer = createReducer() as Reducer<any, any>
    const state = { a: 1 }
    const newState = reducer(state, '')
    expect(newState).toHaveProperty('account')
    expect(newState).toHaveProperty('createWallet')
    expect(newState).toHaveProperty('fatalError')
    expect(newState).toHaveProperty('ledger')
    expect(newState).toHaveProperty('network')
    expect(newState).toHaveProperty('openWallet')
    expect(newState).toHaveProperty('staking')
    expect(newState).toHaveProperty('theme')
    expect(newState).toHaveProperty('transaction')
    expect(newState).toHaveProperty('wallet')
  })
})
