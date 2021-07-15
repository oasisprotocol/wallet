/**
 *
 * AddEscrowForm
 *
 */
import { selectMinStaking } from 'app/state/network/selectors'
import { useTransactionSlice } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import { Box, Button, Form, TextInput } from 'grommet'
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { TransactionStatus } from '../TransactionStatus'

interface Props {
  validatorAddress: string
}

export const AddEscrowForm = memo((props: Props) => {
  const { t } = useTranslation()
  const actions = useTransactionSlice().actions
  const { error, success } = useSelector(selectTransaction)
  const [amount, setAmount] = useState('')
  const dispatch = useDispatch()
  const minStaking = useSelector(selectMinStaking)

  const submit = () => {
    dispatch(
      actions.addEscrow({
        type: 'addEscrow',
        amount: Number(amount),
        validator: props.validatorAddress,
      }),
    )
  }

  useEffect(() => {
    return () => {
      dispatch(actions.clearTransaction())
    }
  }, [dispatch, actions])

  return (
    <Form onSubmit={submit}>
      <Box direction="row" gap="small" pad={{ top: 'small' }}>
        <Box background="background-front">
          <TextInput
            data-testid="amount"
            id="amount-id"
            name="amount"
            placeholder={t('common.amount')}
            type="number"
            step="any"
            min={minStaking}
            value={amount}
            onChange={event => setAmount(event.target.value)}
            required
          />
        </Box>
        <Button
          label={t('account.addEscrow.delegate', 'Delegate')}
          type="submit"
          primary
          style={{ borderRadius: '4px' }}
        />
      </Box>
      <TransactionStatus error={error} success={success} />
    </Form>
  )
})
