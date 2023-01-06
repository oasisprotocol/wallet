/**
 *
 * DateFormatter
 *
 */
import * as React from 'react'

interface Props {
  date: Date | number
}

const dateFormat = new Intl.DateTimeFormat(import.meta.env.NODE_ENV === 'test' ? 'en-US' : undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZone: import.meta.env.NODE_ENV === 'test' ? 'UTC' : undefined,
})

export const intlDateTimeFormat = (date: Date | number) => dateFormat.format(date)

export function DateFormatter(props: Props) {
  return <>{intlDateTimeFormat(props.date)}</>
}
