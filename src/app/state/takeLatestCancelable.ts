import { Action } from '@reduxjs/toolkit'
import { fork, race, take, takeLatest } from 'typed-redux-saga'
/* eslint-disable-next-line no-restricted-imports */
import type { ActionPattern } from 'redux-saga/effects'

/** Like takeLatest, but also cancels running task early if cancelOnAction is dispatched */
export function takeLatestCancelable<StartAction extends Action>({
  startOnAction,
  cancelOnAction,
  task,
}: {
  startOnAction: ActionPattern<StartAction>
  cancelOnAction: ActionPattern<any>
  task: (startAction: StartAction) => Generator
}) {
  return fork(function* () {
    while (true) {
      yield* race({
        task: takeLatest(startOnAction, task),
        cancel: take(cancelOnAction),
      })
    }
  })
}
