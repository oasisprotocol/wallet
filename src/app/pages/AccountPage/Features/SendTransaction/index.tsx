import { AmountTextInput } from 'app/components/AmountTextInput'
import { TransactionStatus } from 'app/components/TransactionStatus'
import { useTransactionSlice } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import { selectAvailableBalanceStringValue } from 'app/state/wallet/selectors'
import { Box, Button, Form, FormField, TextInput } from 'grommet'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface SendTransactionFormState {
  amount: string
  recipient: string
}

const initialSendTransactionFormState = {
  amount: '',
  recipient: '',
}

export function SendTransaction() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const transactionActions = useTransactionSlice().actions
  const { error, success } = useSelector(selectTransaction)
  const availableBalance = useSelector(selectAvailableBalanceStringValue)
  const [formValues, setFormValues] = useState<SendTransactionFormState>(initialSendTransactionFormState)
  const onSubmit = ({ value }) => {
    dispatch(
      transactionActions.sendTransaction({
        type: 'transfer',
        amount: parseFloat(value.amount),
        to: value.recipient.replaceAll(' ', ''),
      }),
    )
  }

  const handleMaxValue = useCallback(
    () =>
      setFormValues({
        ...formValues,
        amount: availableBalance,
      }),
    [formValues, availableBalance],
  )

  // On successful transaction, clear the fields
  useEffect(() => {
    if (success) {
      setFormValues(initialSendTransactionFormState)
    }
  }, [success])

  // Cleanup effect - clear the transaction when the component unmounts
  useEffect(() => {
    return function cleanup() {
      dispatch(transactionActions.clearTransaction())
    }
  }, [dispatch, transactionActions])

  return (
    <Box border={{ color: 'background-front-border', size: '1px' }} round="5px" background="background-front">
      <Form<SendTransactionFormState>
        validate="submit"
        onSubmit={onSubmit}
        onChange={value => setFormValues(value)}
        value={formValues}
      >
        <Box fill gap="medium" pad="medium">
          <FormField
            htmlFor="recipient-id"
            name="recipient"
            label={t('account.sendTransaction.recipient', 'Recipient')}
          >
            <TextInput
              id="recipient-id"
              name="recipient"
              placeholder={t('account.sendTransaction.enterAddress', 'Enter an address')}
              required
            />
          </FormField>
          <AmountTextInput
            disabled={!!availableBalance}
            label={t('common.amount', 'Amount')}
            handleMaxValue={handleMaxValue}
          />
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button
              type="submit"
              label={t('account.sendTransaction.send')}
              style={{ borderRadius: '4px' }}
              primary
            />
          </Box>
        </Box>
      </Form>
      <TransactionStatus error={error} success={success} />
    </Box>
  )
}
