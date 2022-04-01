/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit'
import createWalletReducer from 'app/pages/CreateWalletPage/slice'
import openWalletReducer from 'app/pages/OpenWalletPage/slice'
import accountReducer from 'app/state/account'
import fatalErrorReducer from 'app/state/fatalerror'
import ledgerReducer from 'app/state/ledger'
import networkReducer from 'app/state/network'
import stakingReducer from 'app/state/staking'
import transactionReducer from 'app/state/transaction'
import walletReducer from 'app/state/wallet'
import themeReducer from 'styles/theme/slice'

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers = {}) {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  const rootReducer = combineReducers({
    ...injectedReducers,
    account: accountReducer,
    createWallet: createWalletReducer,
    fatalError: fatalErrorReducer,
    ledger: ledgerReducer,
    network: networkReducer,
    openWallet: openWalletReducer,
    staking: stakingReducer,
    theme: themeReducer,
    transaction: transactionReducer,
    wallet: walletReducer,
  })

  return rootReducer
}
