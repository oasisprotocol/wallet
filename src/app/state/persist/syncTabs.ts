import {
  AnyAction,
  configureStore,
  ConfigureStoreOptions,
  Dispatch,
  EnhancedStore,
  Middleware,
} from '@reduxjs/toolkit'
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
  Config as StateSyncConfig,
  withReduxStateSync,
} from 'redux-state-sync'
import { RootState } from 'types'

/** Syncing tabs is only needed in web app, not in extension. */
export const needsSyncingTabs = !window.chrome?.runtime?.id

const stateSyncConfig: StateSyncConfig = {
  channel: 'oasis_wallet_broadcast_channel',
  broadcastChannelOption: {
    type: 'native', // Prevent fallbacks to e.g. localStorage that would expose password.
  },
}

/** Wrap configureStore with redux-state-sync. */
export function configureStoreWithSyncTabs(
  options: ConfigureStoreOptions<RootState>,
): EnhancedStore<RootState, AnyAction, Middleware<unknown, RootState, Dispatch<AnyAction>>[]> {
  if (typeof options.middleware !== 'function') throw new Error('Unsupported type of options.middleware')
  if (typeof options.reducer !== 'function') throw new Error('Unsupported type of options.reducer')
  if (!needsSyncingTabs) {
    return configureStore(options)
  }

  const optionsMiddleware = options.middleware

  const store = configureStore({
    ...options,
    reducer: withReduxStateSync(options.reducer),
    middleware: getDefaultMiddleware =>
      optionsMiddleware(getDefaultMiddleware).concat(createStateSyncMiddleware(stateSyncConfig)),
  })

  initStateWithPrevTab(store)
  return store
}
