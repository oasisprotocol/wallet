/**
 *
 * ShortAddress
 *
 * Used to render short address or hash.
 */
import { NoTranslate } from 'app/components/NoTranslate'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { trimLongString } from './trimLongString'

interface Props {
  address: string
}

export function ShortAddress(props: Props) {
  const { t } = useTranslation()

  const short = props.address ? trimLongString(props.address) : t('common.unavailable', 'Unavailable')
  return <NoTranslate>{short}</NoTranslate>
}
