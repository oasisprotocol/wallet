import * as oasis from '@oasisprotocol/client'
import { PayloadAction } from '@reduxjs/toolkit'
import { persistActions } from 'app/state/persist'
import { selectSkipUnlockingOnInit } from 'app/state/persist/selectors'
import { config } from 'config'
import { RECEIVE_INIT_STATE } from 'redux-state-sync'
import { all, call, delay, put, race, select, take, takeLatest } from 'typed-redux-saga'
import { backend, backendApi } from 'vendors/backend'

import { networkActions } from '.'
import { selectSelectedNetwork } from './selectors'
import { NetworkType } from './types'

/**
 * Return a nic client for the specified network,
 * or by default, for the currently selected network
 */
export function* getOasisNic(network?: NetworkType) {
  const selectedNetwork = network ? network : yield* select(selectSelectedNetwork)
  const url = config[selectedNetwork].grpc

  const nic = new oasis.client.NodeInternal(url)
  return nic
}

/**
 * Return the explorer APIs for the specified network
 * or by default, for the currently selected network
 */
export function* getExplorerAPIs(network?: NetworkType) {
  const selectedNetwork = yield* select(selectSelectedNetwork)
  const url = config[selectedNetwork][backend()].explorer
  return backendApi(url)
}

export function* selectNetwork({ payload: network }: PayloadAction<NetworkType>) {
  const nic = yield* call(getOasisNic, network)
  const { epoch, chainContext } = yield* all({
    epoch: call([nic, nic.beaconGetEpoch], oasis.consensus.HEIGHT_LATEST),
    chainContext: call([nic, nic.consensusGetChainContext]),
  })

  yield* put(
    networkActions.networkSelected({
      chainContext: chainContext,
      ticker: config[network].ticker,
      epoch: Number(epoch), // TODO: numeric precision
      selectedNetwork: network,
      minimumStakingAmount: config[network].min_delegation,
    }),
  )
}

export function* networkSaga() {
  yield* takeLatest(networkActions.selectNetwork, selectNetwork)
  yield* takeLatest(persistActions.setUnlockedRootState, ({ payload }) =>
    put(networkActions.selectNetwork(payload.persistedRootState.network.selectedNetwork)),
  )
  yield* takeLatest(persistActions.skipUnlocking, () =>
    put(networkActions.selectNetwork(process.env.REACT_APP_LOCALNET ? 'local' : 'mainnet')),
  )
  yield* takeLatest(persistActions.resetRootState, function* () {
    const skipUnlockOnInit = yield* select(selectSkipUnlockingOnInit)
    if (skipUnlockOnInit) {
      yield* put(persistActions.skipUnlocking())
    }
  })

  // Wait for tabs to sync state. >5ms should be enough.
  const maybeSynced = yield* race({
    tabsSynced: take(RECEIVE_INIT_STATE),
    thereAreNoOtherTabs: delay(50),
  })
  const skipUnlockOnInit = yield* select(selectSkipUnlockingOnInit)
  if (!maybeSynced.tabsSynced && skipUnlockOnInit) {
    yield* put(persistActions.skipUnlocking())
  }
}
