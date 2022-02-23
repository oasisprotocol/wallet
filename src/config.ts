import { BackendAPIs } from 'vendors/backend'

export const config = {
  mainnet: {
    [BackendAPIs.OasisMonitor]: {
      explorer: 'https://monitor.oasis.dev',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'https://api.oasisscan.com/mainnet',
    },
    grpc: 'https://grpc.oasis.dev',
  },
  testnet: {
    grpc: 'https://testnet.grpc.oasis.dev',
    [BackendAPIs.OasisMonitor]: {
      explorer: 'https://monitor.oasis.dev/api/testnet',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'https://api.oasisscan.com/testnet',
    },
  },
  local: {
    grpc: 'http://localhost:42280',
    [BackendAPIs.OasisMonitor]: {
      explorer: 'http://localhost:9001',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'http://localhost:9001',
    },
  },
}
