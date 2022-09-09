import { ImportAccountsStep as Step } from 'app/state/importaccounts/types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  step: Step
}

export const ImportAccountsStepFormatter = memo((props: Props) => {
  const { t } = useTranslation()
  const step = props.step

  const stepMap: { [code in Step]: string } = {
    [Step.OpeningUSB]: t('ledger.steps.openingUsb', 'Opening Ledger through USB'),
    [Step.LoadingAccounts]: t('ledger.steps.loadingAccounts', 'Loading account details'),
    [Step.LoadingBalances]: t('ledger.steps.loadingBalances', 'Loading balance details'),
    [Step.Done]: t('ledger.steps.done', 'Done'),
  }

  const message = stepMap[step]
  return <>{message}</>
})
