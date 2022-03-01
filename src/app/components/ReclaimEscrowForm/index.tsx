/**
 *
 * ReclaimEscrowForm
 *
 */
import { useTransactionSlice } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import { Box, Button, Form, Text } from 'grommet'
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { AmountTextInput } from 'app/components/AmountTextInput'
import { parseBigIntStringToInt } from 'app/lib/helpers'
import { TransactionStatus } from '../TransactionStatus'

interface Props {
  /** Currently delegated amount */
  maxAmount: string

  /** Target validator address */
  address: string

  /** Current shares corresponding to maxAmount */
  shares: string
}

export const ReclaimEscrowForm = memo((props: Props) => {
  const { t } = useTranslation()
  const actions = useTransactionSlice().actions
  const { error, success } = useSelector(selectTransaction)
  const [amount, setAmount] = useState('')
  const [shares, setShares] = useState(0)
  const dispatch = useDispatch()

  // Escrow tokens to shares conversion rate
  const rate = Number(props.maxAmount) / Number(props.shares)

  useEffect(() => {
    return () => {
      dispatch(actions.clearTransaction())
    }
  }, [dispatch, actions])

  const amountChanged = (amount: string) => {
    const shares = Number(amount) / Number(rate)
    setAmount(amount)
    setShares(shares)
  }

  const submit = () => {
    dispatch(
      actions.reclaimEscrow({
        type: 'reclaimEscrow',
        amount: Number(amount),
        validator: props.address,
        shares: shares,
      }),
    )
  }

  return (
    <Form onSubmit={submit}>
      <Box direction="row" gap="small" pad={{ top: 'small' }}>
        <Box>
          <Box width="small">
            <AmountTextInput
              handleChange={amountChanged}
              inline={true}
              max={parseBigIntStringToInt(props.maxAmount)}
              min={0.0001}
              placeholder={t('common.amount')}
              value={amount}
            />
          </Box>
        </Box>
        <Button
          label={t('account.reclaimEscrow.reclaim', 'Reclaim')}
          type="submit"
          primary
          style={{ borderRadius: '4px', height: '45px' }}
        />
      </Box>
      {shares > 0 && (
        <Text size="small" data-testid="numberOfShares">
          Corresponding number of shares: {shares}
        </Text>
      )}
      <TransactionStatus error={error} success={success} />
    </Form>
  )
})
