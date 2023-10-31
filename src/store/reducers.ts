/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { AnyAction, combineReducers } from '@reduxjs/toolkit'
import createWalletReducer from 'app/pages/CreateWalletPage/slice'
import fiatOnrampReducer from 'app/pages/FiatOnrampPage/slice'
import accountReducer from 'app/state/account'
import fatalErrorReducer from 'app/state/fatalerror'
import importAccountsReducer from 'app/state/importaccounts'
import networkReducer from 'app/state/network'
import paraTimesReducer from 'app/state/paratimes'
import stakingReducer from 'app/state/staking'
import contactsReducer from 'app/state/contacts'
import evmAccountsReducer from 'app/state/evmAccounts'
import transactionReducer from 'app/state/transaction'
import walletReducer from 'app/state/wallet'
import themeReducer from 'styles/theme/slice'
import persistReducer, { persistActions, receivePersistedRootState } from 'app/state/persist'
import { RootState } from 'types'

function createRootReducer() {
  const rootReducer = combineReducers({
    account: accountReducer,
    contacts: contactsReducer,
    evmAccounts: evmAccountsReducer,
    createWallet: createWalletReducer,
    fiatOnramp: fiatOnrampReducer,
    fatalError: fatalErrorReducer,
    importAccounts: importAccountsReducer,
    network: networkReducer,
    paraTimes: paraTimesReducer,
    staking: stakingReducer,
    theme: themeReducer,
    transaction: transactionReducer,
    wallet: walletReducer,
    persist: persistReducer,
  })

  return rootReducer
}

export function createPersistedRootReducer() {
  const originalRootReducer = createRootReducer()
  return (state: RootState | undefined, action: AnyAction): RootState => {
    const newState = originalRootReducer(state, action)
    if (persistActions.setUnlockedRootState.match(action)) {
      return receivePersistedRootState(
        newState,
        action.payload.persistedRootState,
        action.payload.stringifiedEncryptionKey,
      )
    }
    if (persistActions.resetRootState.match(action)) {
      return originalRootReducer(undefined, action)
    }
    return newState
  }
}
