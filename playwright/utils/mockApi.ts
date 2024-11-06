import { BrowserContext, Page } from '@playwright/test'
import type {
  AccountsRow,
  DelegationRow,
  OperationsRow,
  OperationsRowMethodEnum,
  RuntimeTransactionInfoRow,
  ValidatorRow,
} from '../../src/vendors/oasisscan/index'

export async function mockApi(context: BrowserContext | Page, balance: number) {
  await context.addInitScript(() => ((window as any).REACT_APP_BACKEND = 'oasisscan'))
  await context.route('**/chain/account/info/*', route => {
    route.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          rank: 0,
          address: route.request().url().split('/chain/account/info/')[1],
          available: balance.toString(),
          escrow: '0',
          debonding: '0',
          total: balance.toString(),
          nonce: 1,
          allowances: [],
        } satisfies AccountsRow,
      }),
    })
  })
  await context.route('**/chain/account/delegations?*', route => {
    route.fulfill({
      body: JSON.stringify({ code: 0, data: { list: [], page: 1, size: 500, maxPage: 0, totalSize: 0 } }),
    })
  })
  await context.route('**/chain/account/debonding?*', route => {
    route.fulfill({
      body: JSON.stringify({ code: 0, data: { list: [], page: 1, size: 500, maxPage: 0, totalSize: 0 } }),
    })
  })
  await context.route('**/chain/transactions?*', route => {
    route.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          list: [],
          page: 1,
          size: 20,
          maxPage: 1,
          totalSize: 0,
        },
      }),
    })
  })
  await context.route('**/validator/list?*', route => {
    route.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          list: [],
          active: 120,
          delegators: 49619,
          inactive: 82,
        },
      }),
    })
  })

  await context.route('**/oasis-core.Consensus/GetChainContext', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAEJ4QGIxMWIzNjllMGRhNWJiMjMwYjIyMDEyN2Y1ZTdiMjQyZDM4NWVmOGM2ZjU0OTA2MjQzZjMwYWY2M2M4MTU1MzU=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Beacon/GetEpoch', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAMZR8Q=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Staking/Account', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAGggAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Consensus/GetSignerNonce', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAIYKQ==gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Consensus/EstimateGas', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAMZBPE=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Consensus/SubmitTx', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAA=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })

  // Inside Transak iframe
  await context.route('https://sentry.io/**', route => route.fulfill({ body: '' }))
  await context.route('https://cdn.segment.com/**', route => route.fulfill({ body: '' }))
  await context.route('https://api.segment.io/**', route => route.fulfill({ body: '' }))
  await context.route('https://api.sardine.ai/**', route => route.fulfill({ body: '' }))
}

export async function mockApiMoreData(context: BrowserContext | Page) {
  await mockApi(context, 0)

  await context.route('**/chain/account/info/*', route => {
    route.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          rank: 0,
          address: route.request().url().split('/chain/account/info/')[1],
          available: '23.239060788',
          escrow: '100.996756163',
          debonding: '0',
          total: '124.235816951',
          nonce: 70,
          allowances: [],
        } satisfies AccountsRow,
      }),
    })
  })
  await context.route('**/chain/account/delegations?*', route => {
    route.fulfill({
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
              amount: '100.996756163',
              active: true,
            },
          ] as DelegationRow[],
          page: 1,
          size: 500,
          maxPage: 0,
          totalSize: 0,
        },
      }),
    })
  })
  await context.route('**/chain/account/debonding?*', route => {
    route.fulfill({
      body: JSON.stringify({ code: 0, data: { list: [], page: 1, size: 500, maxPage: 0, totalSize: 0 } }),
    })
  })
  await context.route('**/chain/transactions?*', route => {
    route.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          list: [
            {
              txHash: 'a2356cfe7231c832a3e25eca308de52a2d6fb56923845d0b9a1e810fed1a1a6c',
              height: 6919601,
              method: 'staking.AddEscrow' as OperationsRowMethodEnum,
              fee: '0',
              amount: '100.00',
              shares: '0.00',
              add: true,
              timestamp: 1642862677,
              time: 81860045,
              status: true,
              from: new URL(route.request().url()).searchParams.get('address')!,
              to: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
            },
            {
              txHash: '9d5a9eb4e82633e7847989d3e84bce6a51b18434dea83e7f038091dbbb5c8bd5',
              height: 6919536,
              method: 'staking.Transfer' as OperationsRowMethodEnum,
              fee: '0',
              amount: '119.90',
              shares: null,
              add: true,
              timestamp: 1642862287,
              time: 81860435,
              status: true,
              from: 'oasis1qprje45lh2qqrsy4rcvgx4zpnpzkhkqcm58emr3l',
              to: new URL(route.request().url()).searchParams.get('address')!,
            },
          ] satisfies (OperationsRow | RuntimeTransactionInfoRow)[],
          page: 1,
          size: 20,
          maxPage: 1,
          totalSize: 0,
        },
      }),
    })
  })
  await context.route('**/validator/list?*', route => {
    route.fulfill({
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
              escrow: '134193743.56',
              escrowChange24: '-1097851.50',
              escrowPercent: 0.0326,
              balance: '9107.72',
              totalShares: '97861795.49',
              signs: 19953582,
              proposals: 479302,
              nonce: 0,
              score: 20912186,
              delegators: 23446,
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
              escrow: '185814524.64',
              escrowChange24: '-206667.72',
              escrowPercent: 0.0452,
              balance: '5.65',
              totalShares: '132537985.53',
              signs: 19769052,
              proposals: 1082088,
              nonce: 0,
              score: 21933228,
              delegators: 8756,
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
              rank: 6,
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
              escrow: '131080178.79',
              escrowChange24: '-7133.04',
              escrowPercent: 0.0319,
              balance: '102.82',
              totalShares: '103330721.13',
              signs: 17910526,
              proposals: 1511342,
              nonce: 0,
              score: 20933210,
              delegators: 7988,
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
              rank: 36,
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
              escrow: '40029484.50',
              escrowChange24: '2718.71',
              escrowPercent: 0.0097,
              balance: '19610.66',
              totalShares: '29877258.81',
              signs: 20022313,
              proposals: 309250,
              nonce: 0,
              score: 20640813,
              delegators: 5120,
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
              rank: 4,
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
              escrow: '135556888.36',
              escrowChange24: '3137.73',
              escrowPercent: 0.033,
              balance: '235942.01',
              totalShares: '96556305.00',
              signs: 20053736,
              proposals: 849819,
              nonce: 0,
              score: 21753374,
              delegators: 2360,
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
          ] satisfies ValidatorRow[],
          active: 120,
          delegators: 49619,
          inactive: 82,
        },
      }),
    })
  })
}
