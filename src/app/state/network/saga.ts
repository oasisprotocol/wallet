import * as oasis from '@oasisprotocol/client'
import { PayloadAction } from '@reduxjs/toolkit'
import { put, select, takeEvery } from 'typed-redux-saga'
import { AccountsApi, BlocksApi, Configuration, OperationsListApi } from 'vendors/explorer'

import { networkActions } from '.'
import { selectSelectedNetwork } from './selectors'
import { NetworkType } from './types'

/**
 * Return a nic client for the currently selected network
 */
export function* getOasisNic() {
  let network = yield* select(selectSelectedNetwork)
  let nic = new oasis.client.NodeInternal(
    network === 'local' ? 'http://localhost:42280' : 'https://grpc.testnet.oasis-wallet.com',
  )

  return nic
}

export function* getExplorerAPIs() {
  const network = yield* select(selectSelectedNetwork)
  const config = new Configuration({
    basePath: network === 'local' ? 'http://localhost:9001' : 'https://explorer.testnet.oasis-wallet.com',
  })

  const accounts = new AccountsApi(config)
  const blocks = new BlocksApi(config)
  const operations = new OperationsListApi(config)

  return { accounts, blocks, operations }
}

export function* selectNetwork({ payload: network }: PayloadAction<NetworkType>) {
  yield* put(networkActions.networkSelected(network))
}

export function* networkSaga() {
  yield* takeEvery(networkActions.selectNetwork, selectNetwork)
}
