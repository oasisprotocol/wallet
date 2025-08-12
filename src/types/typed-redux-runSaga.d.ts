/** Improve types - based on typed-redux-saga's fork() */
import { RunSagaOptions, Task } from 'redux-saga'
// eslint-disable-next-line no-restricted-imports
import { SagaReturnType } from 'redux-saga/effects'

interface FixedTask<A> extends Task {
  result: <T = A>() => T | undefined
  toPromise: <T = A>() => Promise<T>
}

declare module 'redux-saga' {
  /**
   * Allows starting sagas outside the Redux middleware environment. Useful if you
   * want to connect a Saga to external input/output, other than store actions.
   *
   * `runSaga` returns a Task object. Just like the one returned from a `fork`
   * effect.
   */
  export function runSaga<Action, State, Args extends any[], Fn extends (...args: Args) => any>(
    options: RunSagaOptions<Action, State>,
    fn: Fn,
    ...args: Args
  ): FixedTask<SagaReturnType<Fn>>
}
