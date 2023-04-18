/**
 *
 * DateFormatter
 *
 */
import * as React from 'react'
import { intlDateTimeFormat } from './intlDateTimeFormat'

interface Props {
  date: Date | number
}

export function DateFormatter(props: Props) {
  return <>{intlDateTimeFormat(props.date)}</>
}
