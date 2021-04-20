import * as oasis from '@oasisprotocol/client'

export const nic = new oasis.client.NodeInternal(
  process.env.REACT_APP_GRPC_ADDRESS ?? 'http://localhost:42280',
)
