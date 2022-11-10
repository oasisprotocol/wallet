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
import { WalletType } from 'app/state/wallet/types'

interface ImportAccountsSelectorSelectorProps {
  accounts: ImportAccountsListAccount[]
}

function ImportAccountsSelector({ accounts }: ImportAccountsSelectorSelectorProps) {
  const dispatch = useDispatch()
  const toggleAccount = (address: string) => dispatch(importAccountsActions.toggleAccount(address))

  return (
    <Box gap="small">
      {accounts.map(a => (
        <Account
          address={a.address}
          balance={a.balance?.available} // TODO: get total balance
          type={a.type}
          onClick={toggleAccount}
          isActive={a.selected}
          displayCheckbox={true}
          displayAccountNumber={true}
          details={a.path.join('/')}
          key={a.address}
        />
      ))}
    </Box>
  )
}

interface ImportAccountsSelectionModalProps {
  abort: () => void
  type: WalletType.Mnemonic | WalletType.Ledger
}

export function ImportAccountsSelectionModal(props: ImportAccountsSelectionModalProps) {
  const { t } = useTranslation()
  const importAccounts = useSelector(selectImportAccounts)
  const error = importAccounts.error
  const selectedAccounts = useSelector(selectSelectedAccounts)
  const dispatch = useDispatch()

  const openAccounts = () => {
    dispatch(
      props.type === WalletType.Ledger
        ? walletActions.openWalletsFromLedger()
        : walletActions.openWalletFromMnemonic(),
    )
  }

  const isBusyImporting = importAccounts.step !== ImportAccountsStep.Idle
  const cancelDisabled = isBusyImporting && !error
  const confirmDisabled = isBusyImporting || selectedAccounts.length === 0


  // Workaround for i18next-scanner to pickup plurals correctly, because it is missing
  // defaultValue_zero, defaultValue_one, defaultValue_other here:
  // https://github.com/i18next/i18next-scanner/blob/4687b6a/src/parser.js#L502-L503
  t('openWallet.importAccounts.accountCounter_zero', 'No account selected')
  t('openWallet.importAccounts.accountCounter_one', 'One account selected')

  return (
    <ResponsiveLayer onEsc={props.abort} onClickOutside={props.abort} modal background="background-front">
      <Box width="800px" pad="medium">
        <ModalHeader>{t('openWallet.importAccounts.selectWallets', 'Select accounts to open')}</ModalHeader>
        <Box>
          <ImportAccountsSelector accounts={importAccounts.accounts} />
        </Box>
        {![ImportAccountsStep.Idle, ImportAccountsStep.LoadingBalances].includes(importAccounts.step) && (
          <Box direction="row" gap="medium" alignContent="center" pad={{ top: 'small' }}>
            <Spinner size="medium" />
            <Box alignSelf="center">
              <Text size="xlarge">
                <ImportAccountsStepFormatter step={importAccounts.step} />
              </Text>
            </Box>
          </Box>
        )}
        {error && (
          <AlertBox color="status-error">
            <ErrorFormatter code={error.code} message={error.message} />
          </AlertBox>
        )}
        <Box direction="row" gap="small" justify="between" pad={{ top: 'medium' }}>
          <Button
            secondary
            label={t('common.cancel', 'Cancel')}
            onClick={props.abort}
            disabled={cancelDisabled}
          />
          <Text textAlign={'center'}>
            {t('openWallet.importAccounts.accountCounter', '{{ count }} accounts selected', {
              count: selectedAccounts.length,
            })}
          </Text>
          <Button
            primary
            data-testid="ledger-open-accounts"
            label={t('openWallet.importAccounts.openWallets', 'Open')}
            onClick={openAccounts}
            disabled={confirmDisabled}
          />
        </Box>
      </Box>
    </ResponsiveLayer>
  )
}
