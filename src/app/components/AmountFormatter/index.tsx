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
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  hideTicker?: boolean
}

export const AmountFormatter = memo((props: Props) => {
  const amount = Number(props.amount) / 10 ** 9
  const amountString = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: props.minimumFractionDigits ?? 1,
    maximumFractionDigits: props.maximumFractionDigits ?? 15,
  }).format(amount)

  const ticker = useSelector(selectTicker)

  if (props.amount == null) return <>-</>
  return (
    <>
      {amountString} {!props.hideTicker && <>{ticker}</>}
    </>
  )
})
