/**
 *
 * FromLedger
 *
 */
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { LedgerStepFormatter } from 'app/components/LedgerStepFormatter'
import { Account } from 'app/components/Toolbar/Features/AccountSelector'
import { ledgerActions, useLedgerSlice } from 'app/state/ledger'
import { selectLedger, selectSelectedLedgerAccounts } from 'app/state/ledger/selectors'
import { LedgerAccount, LedgerStep } from 'app/state/ledger/types'
import { useWalletSlice } from 'app/state/wallet'
import { WalletType } from 'app/state/wallet/types'
import { Text, Box, Button, Heading, Layer, Spinner } from 'grommet'
import * as React from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface LedgerAccountSelectorProps {
  accounts: LedgerAccount[]
}
function LedgerAccountSelector(props: LedgerAccountSelectorProps) {
  const dispatch = useDispatch()
  const toggleAccount = (index: number) => {
    dispatch(ledgerActions.toggleAccount(index))
  }

  const accounts = props.accounts.map((a, index) => (
    <Account
      index={index}
      address={a.address}
      balance={a.balance.total}
      type={WalletType.Ledger}
      onClick={toggleAccount}
      isActive={a.selected}
      displayCheckbox={true}
      details={a.path.join('/')}
      key={index}
    />
  ))
  return <Box gap="small">{accounts}</Box>
}

interface FromLedgerProps {
  abort: () => void
}
export function FromLedger(props: FromLedgerProps) {
  const { t } = useTranslation()
  const ledgerActions = useLedgerSlice().actions
  const walletActions = useWalletSlice().actions

  const ledger = useSelector(selectLedger)
  const error = ledger.error
  const selectedAccounts = useSelector(selectSelectedLedgerAccounts)
  const dispatch = useDispatch()

  const openAccounts = () => {
    dispatch(walletActions.openWalletsFromLedger(selectedAccounts))
  }

  useEffect(() => {
    dispatch(ledgerActions.enumerateAccounts())
    return () => {
      dispatch(ledgerActions.clear())
    }
  }, [dispatch, ledgerActions])

  const cancelDisabled = ledger.step === LedgerStep.Done || error ? false : true
  const confirmDisabled = ledger.step !== LedgerStep.Done || selectedAccounts.length === 0

  return (
    <Layer position="center" modal>
      <Box width="750px" pad="medium" background="background-front">
        <Heading size="1" margin={{ bottom: 'medium', top: 'none' }}>
          {t('openWallet.ledger.selectWallets', 'Select the wallets to open')}
        </Heading>
        {ledger.step && ledger.step !== LedgerStep.Done && (
          <Box direction="row" gap="medium" alignContent="center">
            <Spinner size="medium" />
            <Box alignSelf="center">
              <Text size="xlarge">
                <LedgerStepFormatter step={ledger.step} />
              </Text>
            </Box>
          </Box>
        )}
        {ledger.step && ledger.step === LedgerStep.Done && (
          <Box>
            <LedgerAccountSelector accounts={ledger.accounts} />
          </Box>
        )}
        {error && (
          <Box
            border={{
              color: 'status-error',
              side: 'left',
              size: '3px',
            }}
            background={{
              color: 'status-error',
              opacity: 0.3,
            }}
            pad={{ horizontal: 'small', vertical: 'xsmall' }}
          >
            <Text weight="bold">
              <ErrorFormatter code={error.code} message={error.message} />
            </Text>
          </Box>
        )}
        <Box direction="row" gap="small" alignSelf="end" pad={{ top: 'large' }}>
          <Button
            secondary
            label={t('openWallet.ledger.cancel', 'Cancel')}
            style={{ borderRadius: '4px' }}
            onClick={props.abort}
            disabled={cancelDisabled}
          />
          <Button
            primary
            label={t('openWallet.ledger.openWallets', 'Open')}
            onClick={openAccounts}
            style={{ borderRadius: '4px' }}
            alignSelf="end"
            disabled={confirmDisabled}
          />
        </Box>
      </Box>
    </Layer>
  )
}
