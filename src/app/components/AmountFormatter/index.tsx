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
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { formatBaseUnitsAsRose, formatWeiAsWrose } from 'app/lib/helpers'

export interface AmountFormatterProps {
  amount: StringifiedBigInt | null
  amountUnit?: 'baseUnits' | 'wei'
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  hideTicker?: boolean
  size?: string
  smallTicker?: boolean
}

/**
 * Formats base unit amounts to ROSEs
 */
export const AmountFormatter = memo(
  ({
    amount,
    amountUnit = 'baseUnits',
    minimumFractionDigits,
    maximumFractionDigits,
    hideTicker,
    size,
    smallTicker,
  }: AmountFormatterProps) => {
    const ticker = useSelector(selectTicker)
    const isUsingBaseUnits = amountUnit === 'baseUnits'
    if (amount == null) return <span>-</span>

    const formatter = isUsingBaseUnits ? formatBaseUnitsAsRose : formatWeiAsWrose
    const amountString = formatter(amount, {
      minimumFractionDigits: minimumFractionDigits ?? 1,
      maximumFractionDigits:
        typeof maximumFractionDigits !== 'undefined' ? maximumFractionDigits : isUsingBaseUnits ? 15 : 18,
    })

    const tickerProps = smallTicker
      ? {
          size: 'xsmall',
          weight: 600,
          color: 'lightText',
        }
      : {}

    return (
      <span>
        {amountString}
        {!hideTicker && (
          <Text size={size} {...tickerProps}>
            {' '}
            {ticker}
          </Text>
        )}
      </span>
    )
  },
)
