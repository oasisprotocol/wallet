import * as oasis from '@oasisprotocol/client'
import { PayloadAction } from '@reduxjs/toolkit'
import { config } from 'config'
import { call, put, select, takeEvery } from 'typed-redux-saga'
import { getMonitorAPIs } from 'vendors/monitor'

import { networkActions } from '.'
import { selectSelectedNetwork } from './selectors'
import { NetworkType } from './types'

/**
 * Return a nic client for the specified network,
 * or by default, for the currently selected network
 */
export function* getOasisNic(network?: NetworkType) {
  let selectedNetwork = network ? network : yield* select(selectSelectedNetwork)
  const url = config[selectedNetwork].grpc

  let nic = new oasis.client.NodeInternal(url)
  return nic
}

/**
 * Return the explorer APIs for the specified network
 * or by default, for the currently selected network
 */
export function* getExplorerAPIs(network?: NetworkType) {
  const selectedNetwork = yield* select(selectSelectedNetwork)
  const url = config[selectedNetwork].explorer
  return getMonitorAPIs(url)
}

export function* selectNetwork({ payload: network }: PayloadAction<NetworkType>) {
  const nic = yield* call(getOasisNic, network)
  const epoch = yield* call([nic, nic.beaconGetEpoch], oasis.consensus.HEIGHT_LATEST)
  const ticker = yield* call([nic, nic.stakingTokenSymbol])
  const chainContext = yield* call([nic, nic.consensusGetChainContext])
  const stakingParams = yield* call([nic, nic.stakingConsensusParameters], oasis.consensus.HEIGHT_LATEST)
  const minimumStakingAmount = Number(oasis.quantity.toBigInt(stakingParams.min_delegation)) / 10 ** 9

  yield* put(
    networkActions.networkSelected({
      chainContext: chainContext,
      ticker: ticker,
      epoch: Number(epoch),
      selectedNetwork: network,
      minimumStakingAmount: minimumStakingAmount,
    }),
  )
}

export function* networkSaga() {
  yield* takeEvery(networkActions.selectNetwork, selectNetwork)

  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production' && !process.env.REACT_APP_BYPASS_LOCAL) {
    yield* put(networkActions.selectNetwork('local'))
  } else {
    yield* put(networkActions.selectNetwork('mainnet'))
  }
}
