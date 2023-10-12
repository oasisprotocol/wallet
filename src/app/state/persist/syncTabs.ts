import {
  AnyAction,
  configureStore,
  ConfigureStoreOptions,
  Dispatch,
  EnhancedStore,
  Middleware,
} from '@reduxjs/toolkit'
import { networkActions } from 'app/state/network'
import { isSyncingTabsSupported, needsSyncingTabs, persistActions } from 'app/state/persist'
import { walletActions } from 'app/state/wallet'
import { contactsActions } from 'app/state/contacts'
import { themeActions } from 'styles/theme/slice'
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
  Config as StateSyncConfig,
  withReduxStateSync,
} from 'redux-state-sync'
import { RootState } from 'types'
import { SyncedRootState } from 'app/state/persist/types'

/**
 * When opening a second tab it initially syncs these state slices.
 */
export function receiveInitialTabSyncState(
  prevState: RootState,
  initialSyncState: SyncedRootState,
): RootState {
  return {
    ...prevState,
    theme: initialSyncState.theme,
    wallet: initialSyncState.wallet,
    evmAccounts: initialSyncState.evmAccounts,
    contacts: initialSyncState.contacts,
    network: initialSyncState.network,
    persist: initialSyncState.persist,
  }
}

/**
 * When interacting with a second tab it syncs these actions.
 *
 * See caveat in {@link walletActions.updateBalance} about actions being synced
 * before {@link receiveInitialTabSyncState}!
 */
export const whitelistTabSyncActions = [
  contactsActions.add.type,
  contactsActions.update.type,
  contactsActions.delete.type,
  themeActions.changeTheme.type,
  walletActions.walletOpened.type,
  walletActions.updateBalance.type,
  // NOT networkActions.initialNetworkSelected.type,
  networkActions.networkSelected.type,
  persistActions.setUnlockedRootState.type,
  persistActions.resetRootState.type,
  persistActions.skipUnlocking.type,
]

const stateSyncConfig: StateSyncConfig = {
  channel: 'oasis_wallet_broadcast_channel',
  broadcastChannelOption: {
    type: 'native', // Prevent fallbacks to e.g. localStorage that would expose password.
  },
  whitelist: whitelistTabSyncActions,
  prepareState: (state: RootState): SyncedRootState => {
    return {
      contacts: state.contacts,
      evmAccounts: state.evmAccounts,
      theme: state.theme,
      wallet: state.wallet,
      network: state.network,
      persist: state.persist,
    }
  },
}

/** Wrap configureStore with redux-state-sync if native BroadcastChannel is supported. */
export function configureStoreWithSyncTabs(
  options: ConfigureStoreOptions<RootState>,
): EnhancedStore<RootState, AnyAction, Middleware<unknown, RootState, Dispatch<AnyAction>>[]> {
  if (typeof options.middleware !== 'function') throw new Error('Unsupported type of options.middleware')
  if (typeof options.reducer !== 'function') throw new Error('Unsupported type of options.reducer')
  if (!needsSyncingTabs) {
    return configureStore(options)
  }
  if (!isSyncingTabsSupported) {
    if (!process.env.JEST_WORKER_ID) console.warn('Syncing between tabs is not supported')
    return configureStore(options)
  }

  const optionsMiddleware = options.middleware

  const store = configureStore({
    ...options,
    reducer: withReduxStateSync(options.reducer, receiveInitialTabSyncState),
    middleware: getDefaultMiddleware =>
      optionsMiddleware(getDefaultMiddleware).concat(createStateSyncMiddleware(stateSyncConfig)),
  })

  initStateWithPrevTab(store)
  return store
}
