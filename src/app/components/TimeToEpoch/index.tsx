import { selectEpoch } from 'app/state/network/selectors'
import { useSelector } from 'react-redux'
import * as React from 'react'

interface Props {
  epoch: number
}

const estimatedEpochsPerHour = 1

const relativeFormat = new Intl.RelativeTimeFormat(import.meta.env.NODE_ENV === 'test' ? 'en-US' : undefined)

export function TimeToEpoch(props: Props) {
  const currentEpoch = useSelector(selectEpoch)
  const remainingHours = (props.epoch - currentEpoch) / estimatedEpochsPerHour

  // TODO: add more thresholds if used for other than debonding
  const formattedRemainingTime =
    remainingHours > 48
      ? relativeFormat.format(Math.round(remainingHours / 24), 'day')
      : relativeFormat.format(remainingHours, 'hour')

  return <>{formattedRemainingTime}</>
}
