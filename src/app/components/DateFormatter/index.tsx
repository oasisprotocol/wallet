/**
 *
 * DateFormatter
 *
 */
import * as React from 'react'

interface Props {
  date: Date | number
}

const dateFormat = new Intl.DateTimeFormat(process?.env?.NODE_ENV === 'test' ? 'en-US' : undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZone: process?.env?.NODE_ENV === 'test' ? 'UTC' : undefined,
})

export const intlDateTimeFormat = (date: Date | number) =>
  dateFormat.format(date instanceof Date ? date : date * 1000)

export function DateFormatter(props: Props) {
  return <>{intlDateTimeFormat(props.date)}</>
}
