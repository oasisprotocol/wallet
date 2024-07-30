import { TRANSACTIONS_LIMIT } from '../../../config'
import { RootState } from '../../../types'
import { Transaction, TransactionStatus } from '../transaction/types'
import { hasAccountUnknownPendingTransactions } from './selectors'

const currentAddress = 'oasis1qz78ap0456g2rk7j6rmtvasc9v2kjhz2s58qgj90'

describe('hasAccountUnknownPendingTransactions', () => {
  it('empty account', () => {
    expect(
      hasAccountUnknownPendingTransactions({
        account: {
          address: currentAddress,
          nonce: 0n.toString(),
          transactions: [] as Transaction[],
        },
      } as RootState),
    ).toBe(false)
  })

  it('making first transaction', () => {
    expect(
      hasAccountUnknownPendingTransactions({
        account: {
          address: currentAddress,
          nonce: 1n.toString(),
          transactions: [] as Transaction[],
        },
      } as RootState),
    ).toBe(true)

    expect(
      hasAccountUnknownPendingTransactions({
        account: {
          address: currentAddress,
          nonce: 1n.toString(),
          transactions: [
            {
              from: 'oasis1qp2frld759c6u92pxs768nd2ctnrduhqp5f6f273',
              to: currentAddress, // Received
              status: TransactionStatus.Successful,
              nonce: 0n.toString(),
            },
          ] as Transaction[],
        },
      } as RootState),
    ).toBe(true)

    expect(
      hasAccountUnknownPendingTransactions({
        account: {
          address: currentAddress,
          nonce: 1n.toString(),
          transactions: [
            {
              from: currentAddress, // Sent
              to: 'oasis1qp2frld759c6u92pxs768nd2ctnrduhqp5f6f273',
              status: TransactionStatus.Successful,
              nonce: 0n.toString(),
            },
          ] as Transaction[],
        },
      } as RootState),
    ).toBe(false)
  })

  it('failed transaction also updates account nonce in consensus', () => {
    expect(
      hasAccountUnknownPendingTransactions({
        account: {
          address: currentAddress,
          nonce: 1n.toString(),
          transactions: [
            {
              from: currentAddress,
              to: 'oasis1qp2frld759c6u92pxs768nd2ctnrduhqp5f6f273',
              status: TransactionStatus.Failed,
              nonce: 0n.toString(),
            },
          ] as Transaction[],
        },
      } as RootState),
    ).toBe(false)
  })

  it('multiple pending transactions', () => {
    expect(
      hasAccountUnknownPendingTransactions({
        account: {
          address: currentAddress,
          nonce: 5n.toString(),
          transactions: [
            {
              from: currentAddress, // Sent
              to: 'oasis1qp2frld759c6u92pxs768nd2ctnrduhqp5f6f273',
              status: TransactionStatus.Successful,
              nonce: 0n.toString(),
            },
          ] as Transaction[],
        },
      } as RootState),
    ).toBe(true)
  })

  it('paratime transaction updates a different nonce within the paratime', () => {
    expect(
      hasAccountUnknownPendingTransactions({
        account: {
          address: currentAddress,
          nonce: 1n.toString(),
          transactions: [
            {
              from: currentAddress, // Sent on Emerald
              to: 'oasis1qq235lqj77855qcemcr5w2qm372s4amqcc4v3ztc', // 0xC3ecf872F643C6238Aa20673798eed6F7dA199e9
              status: TransactionStatus.Successful,
              runtimeName: 'Emerald',
              runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
              round: 11129138,
              type: 'consensus.Deposit',
              nonce: 0n.toString(), // Misleading Emerald nonce
            },
          ] as Transaction[],
        },
      } as RootState),
    ).toBe(true)
  })

  it('multiple pages of transactions', () => {
    const onePageOfReceivedTxs = new Array(TRANSACTIONS_LIMIT).fill(null).map(() => ({
      from: 'oasis1qp2frld759c6u92pxs768nd2ctnrduhqp5f6f273',
      to: currentAddress, // Received
      status: TransactionStatus.Successful,
      nonce: 999n.toString(),
    })) as Transaction[]
    expect(
      hasAccountUnknownPendingTransactions({
        account: {
          address: currentAddress,
          nonce: 101n.toString(),
          transactions: onePageOfReceivedTxs,
        },
      } as RootState),
    ).toBe(false) // Can't determine within first page. Assume false.

    const onePageIncludingSentTx = [...onePageOfReceivedTxs]
    onePageIncludingSentTx[4] = {
      from: currentAddress, // Sent
      to: 'oasis1qp2frld759c6u92pxs768nd2ctnrduhqp5f6f273',
      status: TransactionStatus.Successful,
      nonce: 100n.toString(),
    } as Transaction
    expect(
      hasAccountUnknownPendingTransactions({
        account: {
          address: currentAddress,
          nonce: 101n.toString(),
          transactions: onePageIncludingSentTx,
        },
      } as RootState),
    ).toBe(false)
    expect(
      hasAccountUnknownPendingTransactions({
        account: {
          address: currentAddress,
          nonce: 102n.toString(),
          transactions: onePageIncludingSentTx,
        },
      } as RootState),
    ).toBe(true)
  })
})
