import * as oasis from '@oasisprotocol/client'
import { persistActions } from 'app/state/persist'
import { selectSkipUnlockingOnInit } from 'app/state/persist/selectors'
import { config } from 'config'
import { RECEIVE_INIT_STATE } from 'redux-state-sync'
import { all, call, put, select, takeLatest } from 'typed-redux-saga'
import { backend, backendApi } from 'vendors/backend'

import { networkActions } from '.'
import { SyncedRootState } from '../persist/types'
import { selectChainContext, selectSelectedNetwork } from './selectors'
import { NetworkType } from './types'
import { WalletError, WalletErrors } from 'types/errors'

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
 * Return the explorer APIs for the currently selected network
 */
export function* getExplorerAPIs() {
  const selectedNetwork = yield* select(selectSelectedNetwork)
  const url = config[selectedNetwork][backend()].explorer
  return backendApi(url)
}

export function* getChainContext() {
  const chainContext = yield* select(selectChainContext)
  if (chainContext) {
    return chainContext
  }

  try {
    const selectedNetwork = yield* select(selectSelectedNetwork)
    const nic = yield* call(getOasisNic, selectedNetwork)
    const fetchedChainContext = yield* call([nic, nic.consensusGetChainContext])
    yield* put(networkActions.setChainContext(fetchedChainContext))
    return fetchedChainContext
  } catch (error) {
    throw new WalletError(WalletErrors.UnknownGrpcError, 'Could not fetch data')
  }
}

export function* selectNetwork({
  network,
  isInitializing,
}: {
  network: NetworkType
  isInitializing: boolean
}) {
  const nic = yield* call(getOasisNic, network)
  const { epoch } = yield* all({
    epoch: call([nic, nic.beaconGetEpoch], oasis.consensus.HEIGHT_LATEST),
  })
  const networkState = {
    ticker: config[network].ticker,
    epoch: Number(epoch), // Will lose precision in a few billion years at 1 epoch per hour
    selectedNetwork: network,
    minimumStakingAmount: config[network].min_delegation,
  }

  if (isInitializing) {
    yield* put(networkActions.initialNetworkSelected(networkState))
  } else {
    yield* put(networkActions.networkSelected(networkState))
  }
}

export function* networkSaga() {
  yield* takeLatest(
    [
      networkActions.initializeNetwork,
      networkActions.selectNetwork,
      persistActions.setUnlockedRootState,
      persistActions.resetRootState,
      RECEIVE_INIT_STATE,
    ],
    function* (action) {
      const currentNetworkType = yield* select(selectSelectedNetwork)

      if (networkActions.initializeNetwork.match(action)) {
        yield* call(selectNetwork, { network: currentNetworkType, isInitializing: true })
      }
      if (networkActions.selectNetwork.match(action)) {
        yield* call(selectNetwork, { network: action.payload, isInitializing: false })
      }
      if (persistActions.setUnlockedRootState.match(action)) {
        const rootState = action.payload.persistedRootState
        yield* call(selectNetwork, { network: rootState.network.selectedNetwork, isInitializing: false })
      }
      if (persistActions.resetRootState.match(action)) {
        yield* call(selectNetwork, { network: currentNetworkType, isInitializing: false })
      }
      if (action.type === RECEIVE_INIT_STATE) {
        const rootState = (action as any).payload as SyncedRootState
        yield* call(selectNetwork, { network: rootState.network.selectedNetwork, isInitializing: false })
      }
    },
  )
  yield* takeLatest(persistActions.resetRootState, function* () {
    const skipUnlockOnInit = yield* select(selectSkipUnlockingOnInit)
    if (skipUnlockOnInit) {
      yield* put(persistActions.skipUnlocking())
    }
  })

  yield* put(networkActions.initializeNetwork())
}
