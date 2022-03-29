/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit'
import { InjectedReducersType } from 'utils/types/injector-typings'
import { createHashHistory, createBrowserHistory } from 'history'
import { connectRouter } from 'connected-react-router'

export const history = process.env.EXTENSION ? createHashHistory() : createBrowserHistory()

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: InjectedReducersType = {}) {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  return combineReducers({
    ...injectedReducers,
    router: connectRouter(history),
  })
}
