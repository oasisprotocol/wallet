import { routerMiddleware } from 'connected-react-router'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { createInjectorsEnhancer } from 'redux-injectors'
import createSagaMiddleware from 'redux-saga'

import { createReducer, history } from './reducers'
import { RootState } from 'types'
import { fatalErrorActions } from 'app/state/fatalerror'

export function configureAppStore(state?: Partial<RootState>) {
  const sagaMiddleware = createSagaMiddleware({
    onError: (error, info) => {
      store.dispatch(
        fatalErrorActions.setError({
          message: error.message,
          stack: error.stack,
          sagaStack: info.sagaStack,
        }),
      )
    },
  })
  const { run: runSaga } = sagaMiddleware

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware, routerMiddleware(history)]

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ]

  const store = configureStore({
    reducer: createReducer(),
    middleware: [...getDefaultMiddleware(), ...middlewares],
    devTools:
      /* istanbul ignore next line */
      process.env.NODE_ENV !== 'production' || process.env.PUBLIC_URL.length > 0,
    enhancers,
    preloadedState: state,
  })

  return store
}
