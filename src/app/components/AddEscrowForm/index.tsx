/**
 *
 * AddEscrowForm
 *
 */
import { AmountTextInput } from 'app/components/AmountTextInput'
import { selectMinStaking } from 'app/state/network/selectors'
import { useTransactionSlice } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import { selectAvailableBalanceStringValue } from 'app/state/wallet/selectors'
import { Box, Button, Form } from 'grommet'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { TransactionStatus } from '../TransactionStatus'

interface Props {
  validatorAddress: string
}

interface AddEscrowFormState {
  amount: string
}

const initialAddEscrowFormState = {
  amount: '',
}

export const AddEscrowForm = memo((props: Props) => {
  const { t } = useTranslation()
  const actions = useTransactionSlice().actions
  const { error, success } = useSelector(selectTransaction)
  const availableBalance = useSelector(selectAvailableBalanceStringValue)
  const [formValues, setFormValues] = useState<AddEscrowFormState>(initialAddEscrowFormState)
  const dispatch = useDispatch()
  const minStaking = useSelector(selectMinStaking)

  const onSubmit = ({ value }) => {
    dispatch(
      actions.addEscrow({
        type: 'addEscrow',
        amount: Number(value.amount),
        validator: props.validatorAddress,
      }),
    )
  }

  const handleMaxValue = useCallback(
    () =>
      setFormValues({
        amount: availableBalance,
      }),
    [availableBalance],
  )

  useEffect(() => {
    return () => {
      dispatch(actions.clearTransaction())
    }
  }, [dispatch, actions])

  return (
    <Form<AddEscrowFormState>
      onSubmit={onSubmit}
      validate="submit"
      onChange={values => setFormValues(values)}
      value={formValues}
    >
      <Box direction="row" gap="small" pad={{ top: 'small' }}>
        <Box>
          <AmountTextInput
            disabled={Number(availableBalance) === 0}
            placeholder={t('common.amount', 'Amount')}
            handleMaxValue={handleMaxValue}
            min={minStaking}
            inline={true}
          />
        </Box>
        <Box>
          <Button
            label={t('account.addEscrow.delegate', 'Delegate')}
            type="submit"
            primary
            style={{ borderRadius: '4px', height: '46px' }}
          />
        </Box>
      </Box>
      <TransactionStatus error={error} success={success} />
    </Form>
  )
})
