import { NetworkType } from 'app/state/network/types'

export const TRANSACTIONS_LIMIT = 20

export const consensusDecimals = 9

// Moved outside backend.ts to avoid circular dependency
export enum BackendAPIs {
  OasisScanV2 = 'oasisscanV2',
  Nexus = 'nexus',
}

type BackendApiUrls = {
  explorer: string
  blockExplorer: string
  blockExplorerParatimes?: string
  blockExplorerAccount?: string
}

type BackendProviders = {
  grpc: string
  ticker: string // from nic.stakingTokenSymbol()
  min_delegation: number // from nic.stakingConsensusParameters().min_delegation
  [BackendAPIs.OasisScanV2]: BackendApiUrls
  [BackendAPIs.Nexus]: BackendApiUrls
}

type BackendConfig = {
  [key in NetworkType]: BackendProviders
}

export const config: BackendConfig = {
  mainnet: {
    grpc: 'https://grpc.oasis.io',
    ticker: 'ROSE',
    min_delegation: 100,
    [BackendAPIs.OasisScanV2]: {
      explorer: 'https://api.oasisscan.com/v2/mainnet',
      blockExplorer: 'https://oasisscan.com/transactions/{{txHash}}',
      blockExplorerParatimes: 'https://oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
      blockExplorerAccount: 'https://www.oasisscan.com/accounts/detail/{{address}}',
    },
    [BackendAPIs.Nexus]: {
      explorer: 'https://nexus.oasis.io/v1',
      blockExplorer: 'https://explorer.oasis.io/mainnet/consensus/tx/{{txHash}}',
      blockExplorerParatimes: 'https://explorer.oasis.io/mainnet/{{runtimeId}}/tx/{{txHash}}',
      blockExplorerAccount: 'https://explorer.oasis.io/mainnet/consensus/address/{{address}}',
    },
  },
  testnet: {
    grpc: 'https://testnet.grpc.oasis.io',
    ticker: 'TEST',
    min_delegation: 100,
    [BackendAPIs.OasisScanV2]: {
      explorer: 'https://api.oasisscan.com/v2/testnet',
      blockExplorer: 'https://testnet.oasisscan.com/transactions/{{txHash}}',
      blockExplorerParatimes:
        'https://testnet.oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
      blockExplorerAccount: 'https://testnet.oasisscan.com/accounts/detail/{{address}}',
    },
    [BackendAPIs.Nexus]: {
      explorer: 'https://testnet.nexus.oasis.io/v1',
      blockExplorer: 'https://explorer.oasis.io/testnet/consensus/tx/{{txHash}}',
      blockExplorerParatimes: 'https://explorer.oasis.io/testnet/{{runtimeId}}/tx/{{txHash}}',
      blockExplorerAccount: 'https://explorer.oasis.io/testnet/consensus/address/{{address}}',
    },
  },
  local: {
    grpc: 'http://localhost:42280',
    ticker: 'TEST',
    min_delegation: 100,
    [BackendAPIs.OasisScanV2]: {
      explorer: 'http://localhost:9001',
      blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
      blockExplorerParatimes:
        'http://localhost:9001/data/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
      blockExplorerAccount: 'http://localhost:9001/data/accounts/detail/{{address}}',
    },
    [BackendAPIs.Nexus]: {
      explorer: 'http://localhost:9001',
      blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
      blockExplorerParatimes:
        'http://localhost:9001/data/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
      blockExplorerAccount: 'http://localhost:9001/data/accounts/detail/{{address}}',
    },
  },
}

type ParaTimeNetwork = {
  address: string
  runtimeId: string
}

export type ParaTimeConfig = {
  mainnet: ParaTimeNetwork
  testnet: ParaTimeNetwork
  local: Partial<ParaTimeNetwork>
  gasPrice: bigint
  feeGas: bigint
  decimals: number
  displayOrder: number
  type: RuntimeTypes
}

export enum RuntimeTypes {
  Evm = 'evm',
  Oasis = 'oasis',
}

const emeraldConfig: ParaTimeConfig = {
  mainnet: {
    address: 'oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte',
    runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
  },
  testnet: {
    address: 'oasis1qr629x0tg9gm5fyhedgs9lw5eh3d8ycdnsxf0run',
    runtimeId: '00000000000000000000000000000000000000000000000072c8215e60d5bca7',
  },
  local: {
    address: undefined,
    runtimeId: undefined,
  },
  gasPrice: 100n,
  feeGas: 70_000n,
  decimals: 18,
  displayOrder: 2,
  type: RuntimeTypes.Evm,
}

const cipherConfig: ParaTimeConfig = {
  mainnet: {
    address: 'oasis1qrnu9yhwzap7rqh6tdcdcpz0zf86hwhycchkhvt8',
    runtimeId: '000000000000000000000000000000000000000000000000e199119c992377cb',
  },
  testnet: {
    address: 'oasis1qqdn25n5a2jtet2s5amc7gmchsqqgs4j0qcg5k0t',
    runtimeId: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  local: {
    address: undefined,
    runtimeId: undefined,
  },
  gasPrice: 5n,
  feeGas: 5_000_000n,
  decimals: 9,
  displayOrder: 3,
  type: RuntimeTypes.Oasis,
}

const sapphireConfig: ParaTimeConfig = {
  mainnet: {
    address: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
    runtimeId: '000000000000000000000000000000000000000000000000f80306c9858e7279',
  },
  testnet: {
    address: 'oasis1qqczuf3x6glkgjuf0xgtcpjjw95r3crf7y2323xd',
    runtimeId: '000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c',
  },
  local: {
    address: undefined,
    runtimeId: undefined,
  },
  gasPrice: 100n,
  feeGas: 70_000n,
  decimals: 18,
  displayOrder: 1,
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

const splitUrls = (input: string | undefined): string[] =>
  input
    ? input
        .split(',')
        .filter(s => !!s)
        .map(s => s.trim())
    : []

export const deploys = {
  production: splitUrls(process.env.REACT_APP_PRODUCTION_URLS),
  staging: splitUrls(process.env.REACT_APP_STAGING_URLS),
  extension: 'chrome-extension://ppdadbejkmjnefldpcdjhnkpbjkikoip',
  localhost: 'http://localhost:3000',
}
