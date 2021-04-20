/**
 *
 * DateFormatter
 *
 */
import * as React from 'react'

interface Props {
  date: Date | number
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZone: process?.env?.NODE_ENV === 'test' ? 'UTC' : undefined,
})

export function DateFormatter(props: Props) {
  const date = props.date instanceof Date ? props.date : props.date * 1000
  const formatted = dateFormat.format(date)
  return <>{formatted}</>
}
