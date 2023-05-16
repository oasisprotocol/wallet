import createSagaMiddleware from 'redux-saga'

import { createPersistedRootReducer } from './reducers'
import rootSagas from './sagas'
import { RootState } from 'types'
import { fatalErrorActions } from 'app/state/fatalerror'
import { configureStoreWithSyncTabs } from 'app/state/persist/syncTabs'

function tryToGetEffectDescription(effect: any) {
  if (!effect) return
  if (effect.type === 'FORK') {
    if (effect.payload.args[0])
      return `${effect.type} ${effect.payload.fn.name} ${effect.payload.args[0].type}`
    return `${effect.type} ${effect.payload.fn.name}`
  }
  if (effect.type === 'CALL') return `${effect.type} ${effect.payload.fn.name}`
  if (effect.type === 'SELECT') return `${effect.type} ${effect.payload.selector.name}`
  if (effect.type === 'PUT') return `${effect.type} ${effect.payload.action.type}`
  if (effect.type === 'ACTION_CHANNEL' && effect.payload.pattern)
    return `${effect.type} ${effect.payload.pattern}`
  if (effect.type === 'RACE') return `${effect.type} ${Object.keys(effect.payload)}`
  if (effect.type === 'ALL') return `${effect.type} ${Object.keys(effect.payload)}`
  if (effect.type === 'TAKE') {
    if (effect.payload.channel) return `${effect.type} channel`
    if (effect.payload.pattern) return `${effect.type} ${effect.payload.pattern.toString()}`
  }
  if (effect.type) return effect.type
  return
}

function getEffectChain(triggeredOptions: any, effectIdToTriggered: Record<number, any>) {
  let currentTriggered = triggeredOptions
  const chain = [tryToGetEffectDescription(currentTriggered.effect) ?? currentTriggered.effect]
  while (currentTriggered?.parentEffectId) {
    currentTriggered = effectIdToTriggered[currentTriggered.parentEffectId]
    chain.unshift('->')
    chain.unshift(tryToGetEffectDescription(currentTriggered?.effect) ?? currentTriggered?.effect)
  }
  return chain
}

export function configureAppStore(state?: Partial<RootState>) {
  const effectIdToTriggered: Record<number, any> = {}
  const sagaMiddleware = createSagaMiddleware({
    sagaMonitor: {
      effectTriggered(triggeredOptions) {
        effectIdToTriggered[triggeredOptions.effectId] = triggeredOptions
        console.log(...getEffectChain(triggeredOptions, effectIdToTriggered))
      },
    },
    effectMiddlewares: [
      next => effect => {
        const stacktraceName = `== SAGA: ${tryToGetEffectDescription(effect)}`
        return { [stacktraceName]: () => next(effect) }[stacktraceName]()
      },
    ],
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
  const middlewares = [
    api => next => action => {
      const stacktraceName = `== REDUX: ${action.type}`
      return { [stacktraceName]: () => next(action) }[stacktraceName]()
    },
    sagaMiddleware,
  ]

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
