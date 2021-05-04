/**
 *
 * AmountFormatter
 *
 */
import { selectTicker } from 'app/state/network/selectors'
import * as React from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'

interface Props {
  amount: string | number
}

export const AmountFormatter = memo((props: Props) => {
  const amount = Number(props.amount) / 10 ** 9
  const amountString = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 15,
  }).format(amount)

  const ticker = useSelector(selectTicker)

  return (
    <>
      {amountString} {ticker}
    </>
  )
})
