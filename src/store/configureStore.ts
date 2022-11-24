import createSagaMiddleware from 'redux-saga'

import { createPersistedRootReducer } from './reducers'
import rootSagas from './sagas'
import { RootState } from 'types'
import { fatalErrorActions } from 'app/state/fatalerror'
import { configureStoreWithSyncTabs } from 'app/state/persist/syncTabs'

export function configureAppStore(state?: Partial<RootState>) {
  const sagaMiddleware = createSagaMiddleware({
    onError: (error, info) => {
      store.dispatch(
        fatalErrorActions.setError({
          message: error.toString(),
          stack: error.stack,
          sagaStack: info.sagaStack,
        }),
      )
    },
  })

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware]

  const store = configureStoreWithSyncTabs({
    reducer: createPersistedRootReducer(),
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares),
    devTools:
      /* istanbul ignore next line */
      process.env.NODE_ENV !== 'production',
    preloadedState: state,
  })

  sagaMiddleware.run(rootSagas)

  return store
}
