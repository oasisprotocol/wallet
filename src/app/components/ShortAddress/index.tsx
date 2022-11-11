/**
 *
 * ShortAddress
 *
 * Used to render short address or hash.
 */
import { NoTranslate } from 'app/components/NoTranslate'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  address: string
}

export function trimLongString(value: string, trimStart = 10, trimEnd = 8) {
  const trimmedLength = trimStart + 3 + trimEnd
  if (trimmedLength > value.length) {
    // If the "trimmed" version would be longer, don't bother
    // (This also covers the case when the length is et most trimStart)
    return value
  }

  return `${value.slice(0, trimStart)}...${value.slice(-trimEnd)}`
}

export function ShortAddress(props: Props) {
  const { t } = useTranslation()

  const short = props.address ? trimLongString(props.address) : t('common.unavailable', 'Unavailable')
  return <NoTranslate>{short}</NoTranslate>
}
