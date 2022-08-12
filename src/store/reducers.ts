/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit'
import createWalletReducer from 'app/pages/CreateWalletPage/slice'
import accountReducer from 'app/state/account'
import fatalErrorReducer from 'app/state/fatalerror'
import ledgerReducer from 'app/state/ledger'
import networkReducer from 'app/state/network'
import paraTimesReducer from 'app/state/paratimes'
import stakingReducer from 'app/state/staking'
import transactionReducer from 'app/state/transaction'
import walletReducer from 'app/state/wallet'
import themeReducer from 'styles/theme/slice'

export function createReducer() {
  const rootReducer = combineReducers({
    account: accountReducer,
    createWallet: createWalletReducer,
    fatalError: fatalErrorReducer,
    ledger: ledgerReducer,
    network: networkReducer,
    paraTimes: paraTimesReducer,
    staking: stakingReducer,
    theme: themeReducer,
    transaction: transactionReducer,
    wallet: walletReducer,
  })

  return rootReducer
}
