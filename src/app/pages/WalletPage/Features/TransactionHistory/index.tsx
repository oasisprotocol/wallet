import { Box, DataTable, Heading, Text } from 'grommet'
import * as React from 'react'

const dateFormat = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
})

const currencyFormat = new Intl.NumberFormat(undefined, {
  style: 'decimal',
  signDisplay: 'always',
})

const columns = [
  {
    property: 'amount',
    header: 'Amount',
    render: datum => (
      <Text weight="bold" color={datum.amount > 0 ? 'green' : 'red'}>
        {currencyFormat.format(datum.amount)}
      </Text>
    ),
  },
  {
    property: 'type',
    header: 'Type',
  },
  { property: 'address', header: 'Address' },
  {
    property: 'date',
    header: 'Date',
    render: datum => <Text>{dateFormat.format(datum.date)}</Text>,
  },
]

const data = [
  {
    amount: -5000,
    type: 'Sent',
    address: 'oasis1qgax...512bbdc',
    date: new Date(),
  },
  {
    amount: 108.33,
    type: 'Received',
    address: 'oasis1qrvax...2g65ee',
    date: new Date(),
  },
]

export function TransactionHistory() {
  return (
    <Box pad="medium" border={{ color: 'light-3', size: '1px' }} round="5px" background="white">
      <Heading level="4" margin="none">
        Transactions
      </Heading>
      <DataTable
        fill="horizontal"
        columns={columns}
        data={data}
        sortable
        step={10}
        // paginate - Need to update Grommet ?
      />
    </Box>
  )
}
