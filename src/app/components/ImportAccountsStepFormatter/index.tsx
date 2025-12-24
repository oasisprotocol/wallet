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
    [Step.Idle]: t('ledger.steps.idle', 'Idle'),
    [Step.AccessingLedger]: t('ledger.steps.accessingLedger', 'Connecting with Ledger device'),
    [Step.LoadingAccounts]: t('ledger.steps.loadingAccounts', 'Loading account details'),
    [Step.LoadingBalances]: t('ledger.steps.loadingBalances', 'Loading balance details'),
    [Step.LoadingBleDevices]: t('ledger.steps.loadingBluetoothDevices', 'Loading bluetooth devices'),
  }

  const message = stepMap[step]
  return <span>{message}</span>
})
