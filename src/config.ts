import { NetworkType } from 'app/state/network/types'

const interceptors: [string, (...args: any[]) => { body: string }][] = []
function intercept(substr: string, getResponse: (...args: any[]) => { body: string }) {
  interceptors.push([substr, getResponse])
}

const origFetch = window.fetch
window.fetch = async (...args) => {
  const url = args[0]
  if (typeof url !== 'string') return origFetch(...args)
  const interceptor = interceptors.find(([substr, getResponse]) => url.includes(substr))
  if (!interceptor) return origFetch(...args)
  console.log('intercepted fetch', args)
  const response = await interceptor[1](...args)
  console.log('responded fetch', response)
  return new Response(response.body)
}


intercept('/chain/account/info/', () => {
  return {
    body: JSON.stringify({
      code: 0,
      data: {
        rank: 0,
        address: 'oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90',
        available: '24.189060788',
        escrow: '100.777869462',
        debonding: '0',
        total: '124.96693025',
        nonce: 64,
        allowances: [
          {
            address: 'oasis1qrnu9yhwzap7rqh6tdcdcpz0zf86hwhycchkhvt8',
            amount: '0.1',
          },
        ],
      },
    }),
  }
})
intercept('/chain/account/delegations?', () => {
  return {
    body: JSON.stringify({
      code: 0,
      data: {
        list: [
          {
            validatorAddress: 'oasis1qpn83e8hm3gdhvpfv66xj3qsetkj3ulmkugmmxn3',
            validatorName: 'Chorus One',
            icon: 'https://s3.amazonaws.com/keybase_processed_uploads/3a844f583b686ec5285403694b738a05_360_360.jpg',
            entityAddress: null,
            shares: '71.939343766',
            amount: '100.778411345',
            active: true,
          },
        ],
        page: 1,
        size: 500,
        maxPage: 1,
        totalSize: 1,
      },
    }),
  }
})
intercept('/chain/account/debonding?', () => {
  return {
    body: JSON.stringify({ code: 0, data: { list: [], page: 1, size: 500, maxPage: 0, totalSize: 0 } }),
  }
})
intercept('/chain/transactions?', () => {
  return {
    body: JSON.stringify({
      code: 0,
      data: {
        list: [
          {
            runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
            runtimeName: 'Emerald',
            txHash: '47f5772e63ab2907b2c968dd7c9a404de16edf5c027a673b4f93b1f3f0e7c466',
            round: 11129138,
            result: true,
            timestamp: 1720703259,
            type: 'regular',
          },
          {
            txHash: '489ea00db6a2658fb0d00f89accf5bcf48875c6bb3fcb76a3da5c36111d88b7e',
            height: 20087864,
            method: 'staking.Allow',
            fee: '0',
            amount: '0.10',
            shares: null,
            add: true,
            timestamp: 1720703253,
            time: 1159672,
            status: true,
            from: 'oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90',
            to: 'oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte',
          },
        ],
      },
    }),
  }
})
intercept('transaction/489ea00db6a2658fb0d00f89accf5bcf48875c6bb3fcb76a3da5c36111d88b7e', () => {
  return {
    body: JSON.stringify({
      code: 0,
      data: {
        txHash: '489ea00db6a2658fb0d00f89accf5bcf48875c6bb3fcb76a3da5c36111d88b7e',
        timestamp: 1720703253,
        time: 1166684,
        height: 20087864,
        fee: null,
        nonce: 63,
        method: 'staking.Allow',
        from: 'oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90',
        to: null,
        amount: null,
        raw: '{"tx_hash":"489ea00db6a2658fb0d00f89accf5bcf48875c6bb3fcb76a3da5c36111d88b7e","method":"staking.Allow","fee":{"gas":1288},"body":{"beneficiary":"oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte","amount_change":"100000000","negative":false},"nonce":63,"signature":{"signature":"Er/JsA2nHxN4ikW+JASqays8u6KQzYihNBpG1R41nlBiQxDqAiBGXhW1Z1xAz0Rr55jGjn+aejTkgWZ2l8qfAg==","public_key":"rUvKSrh1nypvcdsIqRNZnfb2OiuuWnxI9je+MlhhpRw=","address":"oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90"},"height":20087864,"timestamp":1720703253,"time":"2024-07-11T13:07:33Z","error":{"code":0},"events":[{"staking":{"height":20087864,"tx_hash":"489ea00db6a2658fb0d00f89accf5bcf48875c6bb3fcb76a3da5c36111d88b7e","allowance_change":{"owner":"oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90","beneficiary":"oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte","allowance":"100000000","negative":false,"amount_change":"100000000"}}}]}',
        status: true,
        errorMessage: null,
      },
    }),
  }
})
intercept('hash=47f5772e63ab2907b2c968dd7c9a404de16edf5c027a673b4f93b1f3f0e7c466', () => {
  return {
    body: JSON.stringify({
      code: 0,
      data: {
        runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
        runtimeName: 'Emerald',
        txHash: '47f5772e63ab2907b2c968dd7c9a404de16edf5c027a673b4f93b1f3f0e7c466',
        round: 11129138,
        result: true,
        message: 'null',
        timestamp: 1720703259,
        type: 'regular',
        ctx: {
          method: 'consensus.Deposit',
          from: 'oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90',
          to: 'oasis1qq235lqj77855qcemcr5w2qm372s4amqcc4v3ztc',
          amount: '0.1',
          nonce: 7,
        },
        etx: null,
        events: {
          type: 'deposit',
          tx_hash: '0000000000000000000000000000000000000000000000000000000000000000',
          round: 11129139,
          position: 0,
          i: 0,
          from: 'oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90',
          to: 'oasis1qq235lqj77855qcemcr5w2qm372s4amqcc4v3ztc',
          owner: null,
          nonce: 7,
          amount: [],
          error: null,
        },
      },
    }),
  }
})
intercept('/validator/list?', () => {
  return {
    body: JSON.stringify({
      code: 0,
      data: {
        list: [
          {
            rank: 5,
            entityId: 'zAhtGrpk1L3bBLaP5enm3natUTCoj7MEFryq9+MG4tE=',
            entityAddress: 'oasis1qq0xmq7r0z9sdv02t5j9zs7en3n6574gtg8v9fyt',
            nodeId: 'PsfFUQrXqGoFtowWZcoc8ilh8xHP94LvNYHvqQHpw1E=',
            nodeAddress: 'oasis1qqnucpyju04fjxlg5j5a0akscqhf34ulnsupnwx3',
            name: 'Mars Staking | Long term fee 1%',
            icon: 'https://s3.amazonaws.com/keybase_processed_uploads/f30f9b2207b7d83ef05219ca483b6f05_360_360.jpg',
            website: 'https://linktr.ee/marssuper',
            twitter: null,
            keybase: 'marssuper',
            email: 'marssuper@outlook.com',
            description: null,
            escrow: '138705421.37',
            escrowChange24: '-3022668.08',
            escrowPercent: 0.0335,
            balance: '9107.72',
            totalShares: '101380362.53',
            signs: 19470700,
            proposals: 463116,
            nonce: 0,
            score: 20396932,
            delegators: 23496,
            nodes: null,
            uptime: '100%',
            active: true,
            commission: 0.01,
            bound: null,
            rates: null,
            bounds: null,
            escrowSharesStatus: null,
            escrowAmountStatus: null,
            status: true,
          },
          {
            rank: 1,
            entityId: 'eZuacXy5s3/nolB/E3gF4vqUYdvfOlVaaBXGfZcGwKc=',
            entityAddress: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
            nodeId: 'SQZZd1wsWXdFsqswUoh6hZtmzu+ejuSnrGeHtgIBJDo=',
            nodeAddress: 'oasis1qphhk4g0ncqut2ds40mr932s5p8tkqcu3yaae227',
            name: 'stakefish',
            icon: 'https://s3.amazonaws.com/keybase_processed_uploads/e1378cd4d5203ded716906687ad53905_360_360.jpg',
            website: 'https://stake.fish',
            twitter: 'stakefish',
            keybase: 'bflabs',
            email: 'hi@stake.fish',
            description: null,
            escrow: '188990896.95',
            escrowChange24: '95141.96',
            escrowPercent: 0.0456,
            balance: '5.65',
            totalShares: '135095695.10',
            signs: 19286128,
            proposals: 1059827,
            nonce: 0,
            score: 21405782,
            delegators: 8851,
            nodes: null,
            uptime: '100%',
            active: true,
            commission: 0.05,
            bound: null,
            rates: null,
            bounds: null,
            escrowSharesStatus: null,
            escrowAmountStatus: null,
            status: true,
          },
          {
            rank: 3,
            entityId: '9sAhd+Wi6tG5nAr3LwXD0y9mUKLYqfAbS2+7SZdNHB4=',
            entityAddress: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
            nodeId: '6wbL5/OxvFGxi55o7AxcwKmfjXbXGC1hw4lfnEZxBXA=',
            nodeAddress: 'oasis1qqp0h2h92eev7nsxgqctvuegt8ge3vyg0qyluc4k',
            name: 'BinanceStaking',
            icon: null,
            website: 'https://www.binance.com',
            twitter: null,
            keybase: null,
            email: null,
            description: null,
            escrow: '166714113.10',
            escrowChange24: '-5730.75',
            escrowPercent: 0.0402,
            balance: '102.82',
            totalShares: '131690743.49',
            signs: 17428513,
            proposals: 1491961,
            nonce: 0,
            score: 20412435,
            delegators: 8065,
            nodes: null,
            uptime: '100%',
            active: true,
            commission: 0.1,
            bound: null,
            rates: null,
            bounds: null,
            escrowSharesStatus: null,
            escrowAmountStatus: null,
            status: true,
          },
          {
            rank: 34,
            entityId: 'J2nwlXuYEPNZ0mMH2Phg5RofbZzj65xDvQMNdy9Ji0E=',
            entityAddress: 'oasis1qz22xm9vyg0uqxncc667m4j4p5mrsj455c743lfn',
            nodeId: 'ITrwEekdZNqXrEzvw3GT6Q3AtHDd51f19nD2nVU/f0c=',
            nodeAddress: 'oasis1qzs429ts5f4pvnylnhkhhfgjvtqj35asc5mv68sz',
            name: 'S5',
            icon: 'https://s3.amazonaws.com/keybase_processed_uploads/de32b7ca9108d3d7de68949f81114205_360_360.jpg',
            website: 'https://www.stake5labs.com',
            twitter: 'stake5labs',
            keybase: 'stake5labs',
            email: null,
            description: null,
            escrow: '39941777.98',
            escrowChange24: '697.28',
            escrowPercent: 0.0096,
            balance: '19610.66',
            totalShares: '29866178.38',
            signs: 19539403,
            proposals: 304457,
            nonce: 0,
            score: 20148317,
            delegators: 5124,
            nodes: null,
            uptime: '100%',
            active: true,
            commission: 0.2,
            bound: null,
            rates: null,
            bounds: null,
            escrowSharesStatus: null,
            escrowAmountStatus: null,
            status: true,
          },
          {
            rank: 33,
            entityId: 'ko5wr5SMqhKb+P1kimM1EF/T4SqvW/WjSOwPHigQl+k=',
            entityAddress: 'oasis1qz72lvk2jchk0fjrz7u2swpazj3t5p0edsdv7sf8',
            nodeId: 'aJFHeID4Q7qUfMa42dRwaa9PQrZ/cVDiE3WNt4bQjo0=',
            nodeAddress: 'oasis1qrt395hkglxv82xdlaw043253llcl5uz3s8la238',
            name: 'Ocean Stake',
            icon: 'https://s3.amazonaws.com/keybase_processed_uploads/98c72d275087af707ff08549edd06a05_360_360.jpg',
            website: 'https://keybase.io/oceanabcde',
            twitter: null,
            keybase: 'oceanabcde',
            email: null,
            description: null,
            escrow: '40073715.65',
            escrowChange24: '480.60',
            escrowPercent: 0.0097,
            balance: '234.25',
            totalShares: '30047816.30',
            signs: 19508149,
            proposals: 404099,
            nonce: 0,
            score: 20316347,
            delegators: 3752,
            nodes: null,
            uptime: '100%',
            active: true,
            commission: 0.2,
            bound: null,
            rates: null,
            bounds: null,
            escrowSharesStatus: null,
            escrowAmountStatus: null,
            status: true,
          },
          {
            rank: 6,
            entityId: '9D+kziTxFhg77+cyt+Fwd6eXREkZ1wHw7WX7VG57MeA=',
            entityAddress: 'oasis1qpn83e8hm3gdhvpfv66xj3qsetkj3ulmkugmmxn3',
            nodeId: 'SCA1zoR15jpC2eugP1P/CZBQhMjHEtmJ7+hWemgTdWo=',
            nodeAddress: 'oasis1qrs74qakgmxcrj4vcvl6javrps65awk6x5656msr',
            name: 'Chorus One',
            icon: 'https://s3.amazonaws.com/keybase_processed_uploads/3a844f583b686ec5285403694b738a05_360_360.jpg',
            website: 'https://chorus.one',
            twitter: 'ChorusOne',
            keybase: null,
            email: null,
            description: null,
            escrow: '135527942.08',
            escrowChange24: '-6636.02',
            escrowPercent: 0.0327,
            balance: '5942.01',
            totalShares: '96744839.35',
            signs: 19570467,
            proposals: 833619,
            nonce: 0,
            score: 21237705,
            delegators: 2389,
            nodes: null,
            uptime: '100%',
            active: true,
            commission: 0.05,
            bound: null,
            rates: null,
            bounds: null,
            escrowSharesStatus: null,
            escrowAmountStatus: null,
            status: true,
          },
          {
            rank: 57,
            entityId: '4gbOOU09bcyvM53Up1lTnP+sLb0feniJu0OcUUPCBSs=',
            entityAddress: 'oasis1qzl99wft8jtt7ppprk7ce7s079z3r3t77s6pf3dd',
            nodeId: '+zVbgQqOdY90Z2NQKXFByNT0OwLxj/Ho4j4qT5u2yKM=',
            nodeAddress: 'oasis1qp62cjgdl77hgs67nmgmlsd90y034eh5kg53jvlp',
            name: 'DCC Capital',
            icon: 'https://s3.amazonaws.com/keybase_processed_uploads/6f43e231fb8bdea6bf55a13b910fb405_360_360.jpg',
            website: 'https://dcc.capital/',
            twitter: 'dcccapital',
            keybase: 'dcccapital',
            email: 'dcccapital123@gmail.com',
            description: null,
            escrow: '24014114.95',
            escrowChange24: '-18202.07',
            escrowPercent: 0.0058,
            balance: '7998.64',
            totalShares: '18057909.33',
            signs: 19485913,
            proposals: 212944,
            nonce: 0,
            score: 19911801,
            delegators: 2232,
            nodes: null,
            uptime: '100%',
            active: true,
            commission: 0.2,
            bound: null,
            rates: null,
            bounds: null,
            escrowSharesStatus: null,
            escrowAmountStatus: null,
            status: true,
          },
        ],
      },
    }),
  }
})

export const consensusDecimals = 9

// Moved outside backend.ts to avoid circular dependency
export enum BackendAPIs {
  OasisMonitor = 'oasismonitor',
  OasisScan = 'oasisscan',
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
  [BackendAPIs.OasisMonitor]: BackendApiUrls
  [BackendAPIs.OasisScan]: BackendApiUrls
}

type BackendConfig = {
  [key in NetworkType]: BackendProviders
}

export const config: BackendConfig = {
  mainnet: {
    grpc: 'https://grpc.oasis.io',
    ticker: 'ROSE',
    min_delegation: 100,
    [BackendAPIs.OasisMonitor]: {
      explorer: 'https://monitor.oasis.dev',
      blockExplorer: 'https://oasismonitor.com/operation/{{txHash}}',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'https://api.oasisscan.com/mainnet',
      blockExplorer: 'https://oasisscan.com/transactions/{{txHash}}',
      blockExplorerParatimes: 'https://oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
      blockExplorerAccount: 'https://www.oasisscan.com/accounts/detail/{{address}}',
    },
  },
  testnet: {
    grpc: 'https://testnet.grpc.oasis.io',
    ticker: 'TEST',
    min_delegation: 100,
    [BackendAPIs.OasisMonitor]: {
      explorer: 'https://monitor.oasis.dev/api/testnet',
      blockExplorer: 'https://testnet.oasismonitor.com/operation/{{txHash}}',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'https://api.oasisscan.com/testnet',
      blockExplorer: 'https://testnet.oasisscan.com/transactions/{{txHash}}',
      blockExplorerParatimes:
        'https://testnet.oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
      blockExplorerAccount: 'https://testnet.oasisscan.com/accounts/detail/{{address}}',
    },
  },
  local: {
    grpc: 'http://localhost:42280',
    ticker: 'TEST',
    min_delegation: 100,
    [BackendAPIs.OasisMonitor]: {
      explorer: 'http://localhost:9001',
      blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'http://localhost:9001',
      blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
      blockExplorerParatimes:
        'http://localhost:9001/data/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
      blockExplorerAccount: 'http://localhost:9001/data/accounts/detail/{{address}}',
    },
  },
}

type ParaTimeNetwork = {
  address: string | undefined
  runtimeId: string | undefined
}

export type ParaTimeConfig = {
  mainnet: ParaTimeNetwork
  testnet: ParaTimeNetwork
  local: ParaTimeNetwork
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
  displayOrder: 1,
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
  displayOrder: 2,
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

// https://github.com/mozilla/webextension-polyfill/blob/6e3e26c/src/browser-polyfill.js#L9
export const runtimeIs = (window as any).chrome?.runtime?.id ? 'extension' : 'webapp'

export const deploys = {
  production: 'https://wallet.oasis.io',
  staging: 'https://wallet.stg.oasis.io',
  extension: 'chrome-extension://ppdadbejkmjnefldpcdjhnkpbjkikoip',
}
