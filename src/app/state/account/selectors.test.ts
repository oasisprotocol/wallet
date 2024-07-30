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

  it('multiple pages of transactions', () => {
    const onePageOfReceivedTxs = new Array(20).fill(null).map(() => ({
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
    ).toBe(true) // Can't determine within first page.

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
