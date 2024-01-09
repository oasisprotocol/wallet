import React from 'react'
import { useTranslation } from 'react-i18next'
import { ParaTimeContent } from '../ParaTimeContent'

export const ParaTimesPageInaccessibleForeign = () => {
  const { t } = useTranslation()

  return (
    <ParaTimeContent
      header={t('paraTimes.common.header', 'ParaTime Transfers')}
      description={t('paraTimes.pageInaccessible.foreignAccount', 'Transfers are not available.')}
    />
  )
}

export const ParaTimesPageInaccessibleLedger = () => {
  const { t } = useTranslation()
  return (
    <ParaTimeContent
      header={t('paraTimes.common.header', 'ParaTime Transfers')}
      description={t('paraTimes.pageInaccessible.ledgerAccount', 'Ledger account is not supported.')}
    />
  )
}
