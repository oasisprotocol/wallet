/**
 *
 * ShortAddress
 *
 */
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
  address: string
}

const MiddleEllipsisSpan = styled.span`
  display: flex;
  white-space: nowrap;

  > :first-child {
    text-overflow: ellipsis;
    overflow: hidden;
    min-width: 5ch;
    max-width: 9.4ch;
    margin-right: -3px;
  }

  > :last-child {
    flex-shrink: 0;
  }
`

export function ShortAddress(props: Props) {
  const { t } = useTranslation()

  const a = props.address
  if (!a) return <span>{t('common.unavailable', 'Unavailable')}</span>

  return (
    <MiddleEllipsisSpan>
      <span>{a.slice(0, -8)}</span>
      <span>{a.slice(-8)}</span>
    </MiddleEllipsisSpan>
  )
}
