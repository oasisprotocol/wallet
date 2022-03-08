/**
 *
 * DateFormatter
 *
 */
import * as React from 'react'

interface Props {
  date: Date | number
}

// Workaround - https://github.com/parcel-bundler/parcel/issues/4458
const getTimeZone = () => {
  if (process && process.env && process.env.NODE_ENV === 'test') return 'UTC'
  else return undefined
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZone: getTimeZone(),
})

export function DateFormatter(props: Props) {
  const date = props.date instanceof Date ? props.date : props.date * 1000
  const formatted = dateFormat.format(date)
  return <>{formatted}</>
}
