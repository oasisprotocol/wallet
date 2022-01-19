import { Box } from 'grommet'
import { OperationsRow } from 'vendors/explorer'
import { Transaction } from './components/Transaction'

export function Preview() {
  const receive: OperationsRow = {
    amount: 1_000_000_000,
    timestamp: 1618018255,
    from: 'destinationAddress',
    to: 'sourceAddress',
    type: 'transfer',
  }
  const send: OperationsRow = {
    amount: 1_000_000_000,
    timestamp: 1618018255,
    from: 'sourceAddress',
    to: 'destinationAddress',
    type: 'transfer',
  }
  const delegate: OperationsRow = {
    amount: 1_000_000_000,
    timestamp: 1618018255,
    from: 'sourceAddress',
    to: 'destinationAddress',
    type: 'addescrow',
  }
  const reclaim: OperationsRow = {
    amount: 1_000_000_000,
    timestamp: 1618018255,
    from: 'sourceAddress',
    to: 'destinationAddress',
    type: 'reclaimescrow',
  }

  return (
    <Box pad="small" gap="small">
      <Transaction referenceAddress="sourceAddress" transaction={reclaim} />
      <Transaction referenceAddress="sourceAddress" transaction={delegate} />
      <Transaction referenceAddress="sourceAddress" transaction={send} />
      <Transaction referenceAddress="sourceAddress" transaction={receive} />
    </Box>
  )
}
