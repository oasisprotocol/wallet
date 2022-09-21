/**
 *
 * ShortAddress
 *
 * Used to render short address or hash.
 */
import * as React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  address: string
}

export function trimLongString(value: string, trimStart = 10, trimEnd = -8) {
  // The length of a trimmed string
  const trimmedLength = trimStart + 3 - trimEnd // trimEnd is negative..
  if (value.length <= trimStart || trimmedLength > value.length) {
    // If the "trimmed" version would be longer, don't bother
    return value
  }

  return `${value.slice(0, trimStart)}...${value.slice(trimEnd)}`
}

export function ShortAddress(props: Props) {
  const { t } = useTranslation()

  const short = props.address ? trimLongString(props.address) : t('common.unavailable', 'Unavailable')
  return <>{short}</>
}
