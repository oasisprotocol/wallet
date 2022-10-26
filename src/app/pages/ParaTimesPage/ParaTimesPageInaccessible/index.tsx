import React from 'react'
import { useTranslation } from 'react-i18next'
import { ParaTimeContent } from '../ParaTimeContent'

export const ParaTimesPageInaccessible = () => {
  const { t } = useTranslation()

  return (
    <ParaTimeContent
      header={t('paraTimes.common.header', 'ParaTimes Transfers')}
      description={t('paraTimes.pageInaccessible', 'Transfers are not available.')}
    />
  )
}
