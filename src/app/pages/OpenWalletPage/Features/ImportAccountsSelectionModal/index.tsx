import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AlertBox } from 'app/components/AlertBox'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { ModalHeader } from 'app/components/Header'
import { ImportAccountsStepFormatter } from 'app/components/ImportAccountsStepFormatter'
import { ResponsiveLayer } from 'app/components/ResponsiveLayer'
import { Account } from 'app/components/Toolbar/Features/AccountSelector'
import { importAccountsActions } from 'app/state/importaccounts'
import { selectImportAccounts, selectSelectedAccounts } from 'app/state/importaccounts/selectors'
import { ImportAccountsListAccount, ImportAccountsStep } from 'app/state/importaccounts/types'
import { walletActions } from 'app/state/wallet'
import { Box, Button, Spinner, Text } from 'grommet'

interface ImportAccountsSelectorSelectorProps {
  accounts: ImportAccountsListAccount[]
}

function ImportAccountsSelector({ accounts }: ImportAccountsSelectorSelectorProps) {
  const dispatch = useDispatch()
  const toggleAccount = (address: string) => {
    const index = accounts.findIndex(account => account.address === address)
    dispatch(importAccountsActions.toggleAccount(index))
  }

  return (
    <Box gap="small">
      {accounts.map(a => (
        <Account
          address={a.address}
          balance={a.balance.available} // TODO: get total balance
          type={a.type}
          onClick={toggleAccount}
          isActive={a.selected}
          displayCheckbox={true}
          details={a.path.join('/')}
          key={a.address}
        />
      ))}
    </Box>
  )
}

interface ImportAccountsSelectionModalProps {
  abort: () => void
  type: 'mnemonic' | 'ledger'
}

export function ImportAccountsSelectionModal(props: ImportAccountsSelectionModalProps) {
  const { t } = useTranslation()
  const importAccounts = useSelector(selectImportAccounts)
  const error = importAccounts.error
  const selectedAccounts = useSelector(selectSelectedAccounts)
  const dispatch = useDispatch()

  const openAccounts = () => {
    dispatch(
      props.type === 'ledger'
        ? walletActions.openWalletsFromLedger()
        : walletActions.openWalletFromMnemonic(),
    )
  }
  const cancelDisabled = importAccounts.step === ImportAccountsStep.Done || error ? false : true
  const confirmDisabled = importAccounts.step !== ImportAccountsStep.Done || selectedAccounts.length === 0

  return (
    <ResponsiveLayer onEsc={props.abort} onClickOutside={props.abort} modal background="background-front">
      <Box width="750px" pad="medium">
        <ModalHeader>{t('openWallet.importAccounts.selectWallets', 'Select accounts to open')}</ModalHeader>
        {importAccounts.step && importAccounts.step !== ImportAccountsStep.Done && (
          <Box direction="row" gap="medium" alignContent="center">
            <Spinner size="medium" />
            <Box alignSelf="center">
              <Text size="xlarge">
                <ImportAccountsStepFormatter step={importAccounts.step} />
              </Text>
            </Box>
          </Box>
        )}
        {importAccounts.step && importAccounts.step === ImportAccountsStep.Done && (
          <Box>
            <ImportAccountsSelector accounts={importAccounts.accounts} />
          </Box>
        )}
        {error && (
          <AlertBox color="status-error">
            <ErrorFormatter code={error.code} message={error.message} />
          </AlertBox>
        )}
        <Box direction="row" gap="small" justify="between" pad={{ top: 'large' }}>
          <Button
            secondary
            label={t('common.cancel', 'Cancel')}
            onClick={props.abort}
            disabled={cancelDisabled}
          />
          <Button
            primary
            data-testid="ledger-open-accounts"
            label={t('openWallet.importAccounts.openWallets', 'Open')}
            onClick={openAccounts}
            alignSelf="end"
            disabled={confirmDisabled}
          />
        </Box>
      </Box>
    </ResponsiveLayer>
  )
}
