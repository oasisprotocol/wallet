/**
 *
 * AddEscrowForm
 *
 */
import { useModal } from 'app/components/Modal'
import { selectMinStaking } from 'app/state/network/selectors'
import { Validator } from 'app/state/staking/types'
import { useTransactionSlice } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import { Box, Button, Form, TextInput } from 'grommet'
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { TransactionStatus } from '../TransactionStatus'

interface Props {
  validatorAddress: string
  validatorStatus: Validator['status']
}

export const AddEscrowForm = memo((props: Props) => {
  const { t } = useTranslation()
  const { launchModal } = useModal()
  const actions = useTransactionSlice().actions
  const { error, success } = useSelector(selectTransaction)
  const [amount, setAmount] = useState('')
  const dispatch = useDispatch()
  const minStaking = useSelector(selectMinStaking)

  const delegate = () => {
    dispatch(
      actions.addEscrow({
        type: 'addEscrow',
        amount: Number(amount),
        validator: props.validatorAddress,
      }),
    )
  }
  const submit = () => {
    if (props.validatorStatus !== 'active') {
      launchModal({
        title: t('account.addEscrow.confirmDelegatingToInactive.title', 'Are you sure you want to continue?'),
        description: t(
          'account.addEscrow.confirmDelegatingToInactive.description',
          'Status of this validator is {{validatorStatus}}. Your delegation might not generate any rewards.',
          { validatorStatus: props.validatorStatus },
        ),
        handleConfirm: delegate,
        isDangerous: true,
      })
    } else {
      delegate()
    }
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
