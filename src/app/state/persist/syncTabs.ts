import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
  Config as StateSyncConfig,
  withReduxStateSync,
} from 'redux-state-sync'
import { RootState } from 'types'

const stateSyncConfig: StateSyncConfig = {
  channel: 'oasis_wallet_broadcast_channel',
}

/** Wrap configureStore with redux-state-sync. */
export function configureStoreWithSyncTabs(options: ConfigureStoreOptions<RootState>) {
  if (typeof options.middleware !== 'function') throw new Error('Unsupported type of options.middleware')
  if (typeof options.reducer !== 'function') throw new Error('Unsupported type of options.reducer')

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
