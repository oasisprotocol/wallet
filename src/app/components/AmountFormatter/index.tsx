/**
 *
 * AmountFormatter
 *
 */
import { selectTicker } from 'app/state/network/selectors'
import * as React from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { Text } from 'grommet'
import BigNumber from 'bignumber.js'
import { StringifiedBigInt } from 'types/StringifiedBigInt'

export interface AmountFormatterProps {
  amount: string | StringifiedBigInt | number | null
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  hideTicker?: boolean
  size?: string
  smallTicker?: boolean
}

/**
 * Formats base unit amounts to ROSEs
 */
export const AmountFormatter = memo((props: AmountFormatterProps) => {
  const ticker = useSelector(selectTicker)
  if (props.amount == null) return <>-</>

  const roseBN = new BigNumber(props.amount).shiftedBy(-9) // / 10 ** 9
  const amountString = roseBN.toFormat(
    Math.min(
      Math.max(roseBN.decimalPlaces(), props.minimumFractionDigits ?? 1),
      props.maximumFractionDigits ?? 15,
    ),
  )

  const tickerProps = props.smallTicker
    ? {
        size: 'xsmall',
        weight: 600,
        color: '#a3a3a3',
      }
    : {}

  return (
    <>
      {amountString}
      {!props.hideTicker && (
        <Text margin={{ left: 'xxsmall' }} size={props.size} {...tickerProps}>
          {ticker}
        </Text>
      )}
    </>
  )
})
