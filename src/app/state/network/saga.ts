import * as oasis from '@oasisprotocol/client'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, select, takeEvery } from 'typed-redux-saga'
import { AccountsApi, BlocksApi, Configuration, OperationsListApi } from 'vendors/explorer'

import { networkActions } from '.'
import { selectSelectedNetwork } from './selectors'
import { NetworkType } from './types'

/**
 * Return a nic client for the specified network,
 * or by default, for the currently selected network
 */
export function* getOasisNic(network?: NetworkType) {
  let selectedNetwork = network ? network : yield* select(selectSelectedNetwork)
  let nic = new oasis.client.NodeInternal(
    selectedNetwork === 'local' ? 'http://localhost:42280' : 'https://grpc.testnet.oasis-wallet.com',
  )

  return nic
}

/**
 * Return the explorer APIs for the specified network
 * or by default, for the currently selected network
 */
export function* getExplorerAPIs(network?: NetworkType) {
  const selectedNetwork = yield* select(selectSelectedNetwork)
  const config = new Configuration({
    basePath:
      selectedNetwork === 'local' ? 'http://localhost:9001' : 'https://explorer.testnet.oasis-wallet.com',
  })

  const accounts = new AccountsApi(config)
  const blocks = new BlocksApi(config)
  const operations = new OperationsListApi(config)

  return { accounts, blocks, operations }
}

export function* selectNetwork({ payload: network }: PayloadAction<NetworkType>) {
  const nic = yield* call(getOasisNic, network)
  const genesis = yield* call([nic, nic.consensusGetGenesisDocument])
  const ticker = genesis.staking.token_symbol
  const chainContext = yield* call([oasis, oasis.genesis.chainContext], genesis)

  yield* put(
    networkActions.networkSelected({
      chainContext: chainContext,
      ticker: ticker,
      selectedNetwork: network,
    }),
  )
}

export function* networkSaga() {
  yield* takeEvery(networkActions.selectNetwork, selectNetwork)

  // Select another default network
  yield* put(networkActions.selectNetwork('local'))
}
