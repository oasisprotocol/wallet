import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Button, Form, FormField, Text, TextInput } from 'grommet'
import { Trans, useTranslation } from 'react-i18next'

import {
  formatBaseUnitsAsRose,
  formatWeiAsWrose,
  isAmountGreaterThan,
  isEvmcAmountGreaterThan,
} from 'app/lib/helpers'
import { paraTimesActions } from 'app/state/paratimes'
import { AlertBox } from 'app/components/AlertBox'
import { AmountFormatter } from '../../../components/AmountFormatter'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'
import { FeesSection } from './FeesSection'

export const TransactionAmount = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    balance,
    balanceInBaseUnit,
    consensusDecimals,
    isDepositing,
    isEvmcParaTime,
    isLoading,
    isWalletEmpty,
    paraTimeName,
    setTransactionForm,
    ticker,
    transactionForm,
  } = useParaTimes()
  const { navigateToRecipient, navigateToConfirmation } = useParaTimesNavigation()
  const formatter = balanceInBaseUnit ? formatBaseUnitsAsRose : formatWeiAsWrose
  const balanceValidator = balanceInBaseUnit ? isAmountGreaterThan : isEvmcAmountGreaterThan
  const disabled = !isLoading && isWalletEmpty

  useEffect(() => {
    if (isDepositing) {
      return
    }

    dispatch(
      isEvmcParaTime
        ? paraTimesActions.fetchBalanceUsingEthPrivateKey()
        : paraTimesActions.fetchBalanceUsingOasisAddress(),
    )
  }, [dispatch, isDepositing, isEvmcParaTime])

  return (
    <ParaTimeContent
      description={
        <Trans
          i18nKey="paraTimes.amount.description"
          t={t}
          values={{
            actionType: isDepositing
              ? t('paraTimes.amount.receiving', 'to the receiving')
              : t('paraTimes.amount.withdrawing', 'from the withdrawing'),
            paratimeType: isEvmcParaTime ? t('paraTimes.common.evmcType', '(EVMc)') : '',
            paraTime: paraTimeName,
            ticker,
          }}
          defaults='Please enter the amount of {{ticker}} tokens you wish to transfer {{actionType}} wallet on the <strong>{{paraTime}}</strong> {{paratimeType}} ParaTime and then click "Next"'
        />
      }
      isLoading={isLoading}
    >
      {disabled && (
        <AlertBox color="status-warning">
          {t('paraTimes.amount.emptyWallet', 'The wallet is empty. There is nothing to withdraw.')}
        </AlertBox>
      )}

      <Box margin={{ bottom: 'medium' }}>
        <Form
          messages={{ required: t('paraTimes.validation.required', 'Field is required') }}
          noValidate
          onChange={nextValue => setTransactionForm(nextValue)}
          onSubmit={navigateToConfirmation}
          value={transactionForm}
        >
          <Box margin={{ bottom: 'small' }}>
            <Box width="medium" direction="row" margin="none" align="center" style={{ position: 'relative' }}>
              <FormField
                name="amount"
                style={{ width: '100%' }}
                required
                validate={[
                  (amount: string) =>
                    !new RegExp(`^\\d*(?:[.][0-9]{0,${consensusDecimals}})?$`).test(amount)
                      ? {
                          message: t(
                            'paraTimes.validation.invalidDecimalValue',
                            'Maximum of {{decimals}} decimal places is allowed',
                            { decimals: consensusDecimals },
                          ),
                          status: 'error',
                        }
                      : undefined,
                  (amount: string) =>
                    balanceValidator(amount, balance!)
                      ? {
                          message: t('errors.insufficientBalance', 'Insufficient balance'),
                          status: 'error',
                        }
                      : undefined,
                ]}
              >
                <TextInput
                  disabled={disabled}
                  inputMode="decimal"
                  name="amount"
                  placeholder="0"
                  value={transactionForm.amount}
                />
              </FormField>
              {balance && (
                <Button
                  disabled={disabled}
                  style={{
                    fontWeight: 'bold',
                    zIndex: 2,
                    position: 'absolute',
                    top: '15px',
                    right: 0,
                  }}
                  plain
                  label={t('paraTimes.amount.max', 'MAX')}
                  onClick={() =>
                    setTransactionForm({ ...transactionForm, amount: formatter(balance).replaceAll(',', '') })
                  }
                />
              )}
            </Box>

            <Box align="end">
              <Text weight="bolder" size="small">
                {t('paraTimes.amount.available', 'Available:')}{' '}
                <AmountFormatter
                  amount={balance}
                  smallTicker
                  amountUnit={balanceInBaseUnit ? 'baseUnits' : 'wei'}
                />
              </Text>
            </Box>
          </Box>
          <FeesSection
            feeAmount={transactionForm.feeAmount}
            feeGas={transactionForm.feeGas}
            ticker={ticker}
          />
          <ParaTimeFormFooter
            disabled={disabled}
            secondaryAction={navigateToRecipient}
            submitButton
            withNotice={isEvmcParaTime}
          />
        </Form>
      </Box>
    </ParaTimeContent>
  )
}
