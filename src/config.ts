import { BackendAPIs } from 'vendors/backend'
import { NetworkType } from 'app/state/network/types'

export const consensusDecimals = 9

type BackendApiUrls = {
  explorer: string
  blockExplorer: string
  blockExplorerParatimes?: string
}

type BackendProviders = {
  grpc: string
  [BackendAPIs.OasisMonitor]: BackendApiUrls
  [BackendAPIs.OasisScan]: BackendApiUrls
}

type BackendConfig = {
  [key in NetworkType]: BackendProviders
}

export const config: BackendConfig = {
  mainnet: {
    [BackendAPIs.OasisMonitor]: {
      explorer: 'https://monitor.oasis.dev',
      blockExplorer: 'https://oasismonitor.com/operation/{{txHash}}',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'https://api.oasisscan.com/mainnet',
      blockExplorer: 'https://oasisscan.com/transactions/{{txHash}}',
      blockExplorerParatimes: 'https://oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
    },
    grpc: 'https://grpc.oasis.dev',
  },
  testnet: {
    grpc: 'https://testnet.grpc.oasis.dev',
    [BackendAPIs.OasisMonitor]: {
      explorer: 'https://monitor.oasis.dev/api/testnet',
      blockExplorer: 'https://testnet.oasismonitor.com/operation/{{txHash}}',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'https://api.oasisscan.com/testnet',
      blockExplorer: 'https://testnet.oasisscan.com/transactions/{{txHash}}',
      blockExplorerParatimes:
        'https://testnet.oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
    },
  },
  local: {
    grpc: 'http://localhost:42280',
    [BackendAPIs.OasisMonitor]: {
      explorer: 'http://localhost:9001',
      blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'http://localhost:9001',
      blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
      blockExplorerParatimes:
        'http://localhost:9001/data/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
    },
  },
}

type ParaTimeNetwork = {
  runtimeId: string | undefined
}

type ParaTimeConfig = {
  mainnet: ParaTimeNetwork
  testnet: ParaTimeNetwork
  local: ParaTimeNetwork
  decimals: number
  type: RuntimeTypes
}

export enum RuntimeTypes {
  Evm = 'evm',
  Oasis = 'oasis',
}

const emeraldConfig: ParaTimeConfig = {
  mainnet: {
    runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
  },
  testnet: {
    runtimeId: '00000000000000000000000000000000000000000000000072c8215e60d5bca7',
  },
  local: {
    runtimeId: undefined,
  },
  decimals: 18,
  type: RuntimeTypes.Evm,
}

const cipherConfig: ParaTimeConfig = {
  mainnet: {
    runtimeId: '000000000000000000000000000000000000000000000000e199119c992377cb',
  },
  testnet: {
    runtimeId: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  local: {
    runtimeId: undefined,
  },
  decimals: 9,
  type: RuntimeTypes.Oasis,
}

const sapphireConfig: ParaTimeConfig = {
  mainnet: {
    runtimeId: undefined,
  },
  testnet: {
    runtimeId: '000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c',
  },
  local: {
    runtimeId: undefined,
  },

  decimals: 18,
  type: RuntimeTypes.Evm,
}

export enum ParaTime {
  Cipher = 'cipher',
  Emerald = 'emerald',
  Sapphire = 'sapphire',
}

type ParaTimesConfig = {
  [key in ParaTime]: ParaTimeConfig
}

export const paraTimesConfig: ParaTimesConfig = {
  [ParaTime.Cipher]: cipherConfig,
  [ParaTime.Emerald]: emeraldConfig,
  [ParaTime.Sapphire]: sapphireConfig,
}
