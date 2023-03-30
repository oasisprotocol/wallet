import { expectSaga } from 'redux-saga-test-plan'
import { put, take } from 'typed-redux-saga'
import { takeLatestCancelable } from './takeLatestCancelable'

function* exampleSaga({ payload }: any) {
  try {
    yield* put({ type: 'started', payload: payload })
    while (true) {
      yield* take('ping')
      yield* put({ type: 'pong', payload: payload })
    }
  } finally {
    yield* put({ type: 'stopped', payload: payload })
  }
}

describe('takeLatestCancelable', () => {
  it('should start finite tasks', () => {
    return expectSaga(takeLatestCancelable, {
      startOnAction: 'start',
      cancelOnAction: 'cancel',
      task: function* () {
        yield* put({ type: 'finished' })
      },
    })
      .dispatch({ type: 'start' })
      .put({ type: 'finished' })
      .dispatch({ type: 'start' })
      .put({ type: 'finished' })
      .dispatch({ type: 'cancel' })
      .dispatch({ type: 'start' })
      .put({ type: 'finished' })
      .dispatch({ type: 'cancel' })
      .not.put.like({}) // No outstanding puts
      .silentRun(50)
  })

  it('should do nothing until start', () => {
    return expectSaga(takeLatestCancelable, {
      startOnAction: 'start',
      cancelOnAction: 'cancel',
      task: function* () {
        yield* put({ type: 'finished' })
      },
    })
      .dispatch({ type: 'cancel' })
      .not.put.like({}) // No outstanding puts
      .silentRun(50)
  })

  it('should start and cancel infinite tasks', () => {
    return expectSaga(takeLatestCancelable, {
      startOnAction: 'start',
      cancelOnAction: 'cancel',
      task: exampleSaga,
    })
      .dispatch({ type: 'start', payload: 'start1' })
      .put({ type: 'started', payload: 'start1' })
      .dispatch({ type: 'ping' })
      .put({ type: 'pong', payload: 'start1' })
      .dispatch({ type: 'ping' })
      .put({ type: 'pong', payload: 'start1' })
      .dispatch({ type: 'cancel' })
      .put({ type: 'stopped', payload: 'start1' })

      .dispatch({ type: 'ping' }) // No pong
      .dispatch({ type: 'cancel' }) // No stopped

      .dispatch({ type: 'start', payload: 'start2' })
      .put({ type: 'started', payload: 'start2' })
      .dispatch({ type: 'ping' })
      .put({ type: 'pong', payload: 'start2' })
      .dispatch({ type: 'cancel' })
      .put({ type: 'stopped', payload: 'start2' })

      .not.put.like({}) // No outstanding puts
      .silentRun(50)
  })

  it('should auto-cancel if restarted', () => {
    return expectSaga(takeLatestCancelable, {
      startOnAction: 'start',
      cancelOnAction: 'cancel',
      task: exampleSaga,
    })
      .dispatch({ type: 'start', payload: 'start1' })
      .put({ type: 'started', payload: 'start1' })
      .dispatch({ type: 'start', payload: 'start2' })
      .put({ type: 'stopped', payload: 'start1' }) // Auto-cancelled
      .put({ type: 'started', payload: 'start2' })
      .dispatch({ type: 'ping' })
      .put({ type: 'pong', payload: 'start2' })
      .dispatch({ type: 'cancel' })
      .put({ type: 'stopped', payload: 'start2' })
      .not.put.like({}) // No outstanding puts
      .silentRun(50)
  })
})
