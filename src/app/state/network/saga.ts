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

function getBlocksPerEpoch(genesis: oasis.types.GenesisDocument): number {
  if (genesis.beacon.params?.insecure_parameters?.interval) {
    return Number(genesis.beacon.params.insecure_parameters.interval)
  } else {
    const pvss = genesis.beacon.params.pvss_parameters!
    return Number(pvss.commit_interval) + Number(pvss.reveal_interval) + Number(pvss.transition_delay)
  }
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
  const genesis = yield* call([nic, nic.consensusGetGenesisDocument])
  const epoch = yield* call([nic, nic.beaconGetEpoch], oasis.consensus.HEIGHT_LATEST)
  const ticker = genesis.staking.token_symbol
  const chainContext = yield* call([oasis, oasis.genesis.chainContext], genesis)

  yield* put(
    networkActions.networkSelected({
      chainContext: chainContext,
      ticker: ticker,
      epoch: Number(epoch),
      selectedNetwork: network,
      blocksPerEpoch: getBlocksPerEpoch(genesis),
      minimumStakingAmount: Number(oasis.quantity.toBigInt(genesis.staking.params.min_delegation)) / 10 ** 9,
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
