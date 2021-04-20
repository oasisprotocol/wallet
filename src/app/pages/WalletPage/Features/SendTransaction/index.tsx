import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { Box, Button, Form, FormField, TextInput, Text } from 'grommet'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { walletActions } from '../../slice'
import { selectTransactionStatus } from '../../slice/selectors'

export function SendTransaction() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { error, success } = useSelector(selectTransactionStatus)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const onSubmit = () => {
    dispatch(walletActions.sendTransaction({ amount: parseFloat(amount), to: recipient.replaceAll(' ', '') }))
  }

  // On successful transaction, clear the fields
  useEffect(() => {
    if (success) {
      setRecipient('')
      setAmount('')
    }
  }, [success])

  // Cleanup effect
  useEffect(() => {
    return function cleanup() {
      dispatch(walletActions.clearTransaction())
    }
  }, [dispatch])

  return (
    <Box border={{ color: 'light-3', size: '1px' }} round="5px" background="white">
      <Form>
        <Box fill gap="medium" pad="medium">
          <FormField
            htmlFor="recipient-id"
            name="recipient"
            label={t('account.sendTransaction.recipient', 'Recipient')}
          >
            <TextInput
              id="recipient-id"
              name="recipient"
              value={recipient}
              placeholder={t('account.sendTransaction.enterAddress', 'Enter an address')}
              onChange={event => setRecipient(event.target.value)}
              required
            />
          </FormField>
          <FormField htmlFor="amount-id" name="amount" label={t('common.amount', 'Amount')}>
            <TextInput
              id="amount-id"
              name="amount"
              placeholder="0"
              type="float"
              min="0"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              required
            />
          </FormField>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button
              type="submit"
              label={t('account.sendTransaction.send')}
              style={{ borderRadius: '4px' }}
              onClick={onSubmit}
              primary
            />
          </Box>
        </Box>
      </Form>
      {error && (
        <Box background="status-error" pad={{ horizontal: 'small', vertical: 'xsmall' }}>
          <Text weight="bold">
            <ErrorFormatter code={error.code} message={error.message} />
          </Text>
        </Box>
      )}
      {success && (
        <Box background="status-ok" pad={{ horizontal: 'small', vertical: 'xsmall' }}>
          <Text weight="bold">{t('account.sendTransaction.success', 'Transaction successfully sent')}</Text>
        </Box>
      )}
    </Box>
  )
}
