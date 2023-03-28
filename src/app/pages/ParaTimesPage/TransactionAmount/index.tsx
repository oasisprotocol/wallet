import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useDispatch } from 'react-redux'
import { Box, Button, Form, FormField, Text, TextInput, Tip } from 'grommet'
import { Trans, useTranslation } from 'react-i18next'
import { getDefaultFeeAmount, isAmountGreaterThan, parseConsensusToLayerBaseUnit } from 'app/lib/helpers'
import { paraTimesActions } from 'app/state/paratimes'
import { AlertBox } from 'app/components/AlertBox'
import { AmountFormatter } from '../../../components/AmountFormatter'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'
import { FeesSection } from './FeesSection'
import styled from 'styled-components'
import { normalizeColor } from 'grommet/es6/utils'
import { consensusDecimals } from '../../../../config'
import { StringifiedBigInt } from 'types/StringifiedBigInt'

const StyledMaxButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 0;
  z-index: 2;
  background-color: ${({ theme }) => normalizeColor('background-front', theme)};
  font-weight: bold;
`

const getMaxAmount = (
  isDepositing: boolean,
  layerDecimals: number,
  balance: StringifiedBigInt,
  feeAmount: string,
) => {
  const shiftBy = isDepositing ? consensusDecimals : layerDecimals
  const fee = parseConsensusToLayerBaseUnit(feeAmount, shiftBy)
  const maxAmount = new BigNumber(balance).minus(fee).shiftedBy(-shiftBy)
  // Make value valid for Consensus input
  return maxAmount.decimalPlaces(consensusDecimals, BigNumber.ROUND_DOWN).toFixed()
}

export const TransactionAmount = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    balance,
    balanceInBaseUnit,
    isDepositing,
    isEvmcParaTime,
    isLoading,
    isWalletEmpty,
    paraTimeConfig,
    paraTimeName,
    setTransactionForm,
    ticker,
    transactionForm,
  } = useParaTimes()
  const { navigateToRecipient, navigateToConfirmation } = useParaTimesNavigation()
  const disabled = !isLoading && isWalletEmpty
  const defaultFeeAmount = getDefaultFeeAmount(isDepositing, paraTimeConfig)

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
          onSubmit={() => {
            setTransactionForm({
              ...transactionForm,
              defaultFeeAmount,
            })
            navigateToConfirmation()
          }}
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
                    isAmountGreaterThan(
                      amount,
                      getMaxAmount(isDepositing, paraTimeConfig.decimals, balance!, '0'),
                    )
                      ? {
                          message: t('errors.insufficientBalance', 'Insufficient balance'),
                          status: 'error',
                        }
                      : undefined,
                  (amount: string) =>
                    isAmountGreaterThan(
                      amount,
                      getMaxAmount(
                        isDepositing,
                        paraTimeConfig.decimals,
                        balance!,
                        transactionForm.feeAmount || defaultFeeAmount,
                      ),
                    )
                      ? {
                          message: t(
                            'paraTimes.validation.insufficientBalanceToPayFee',
                            'Insufficient balance to pay the fee',
                          ),
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
                <Tip
                  content={t('paraTimes.amount.tooltip', 'Max value may be decreased by the fee')}
                  dropProps={{ align: { bottom: 'top' } }}
                >
                  <StyledMaxButton
                    disabled={disabled}
                    plain
                    label={t('paraTimes.amount.max', 'MAX')}
                    onClick={() =>
                      setTransactionForm({
                        ...transactionForm,
                        amount: getMaxAmount(
                          isDepositing,
                          paraTimeConfig.decimals,
                          balance,
                          transactionForm.feeAmount || defaultFeeAmount,
                        ),
                      })
                    }
                  />
                </Tip>
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
