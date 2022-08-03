/**
 *
 * ReclaimEscrowForm
 *
 */
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import { transactionActions } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import BigNumber from 'bignumber.js'
import { Box, Button, Form, TextInput, Text } from 'grommet'
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { TransactionStatus } from '../TransactionStatus'

interface Props {
  /** Currently delegated amount */
  maxAmount: StringifiedBigInt

  /** Current shares corresponding to maxAmount */
  maxShares: StringifiedBigInt

  /** Target validator address */
  address: string
}

export const ReclaimEscrowForm = memo((props: Props) => {
  const { t } = useTranslation()
  const { error, success } = useSelector(selectTransaction)
  const [amount, setAmount] = useState('')
  const [shares, setShares] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(transactionActions.clearTransaction())
    }
  }, [dispatch])

  const amountChanged = (amount: string) => {
    const shares = (Number(amount) * Number(props.maxShares)) / Number(props.maxAmount)
    setAmount(amount)
    setShares(shares)
  }

  const submit = () => {
    dispatch(
      transactionActions.reclaimEscrow({
        type: 'reclaimEscrow',
        amount: parseRoseStringToBaseUnitString(amount),
        shares: parseRoseStringToBaseUnitString('' + shares),
        validator: props.address,
      }),
    )
  }

  const reclaimAll = () => {
    dispatch(
      transactionActions.reclaimEscrow({
        type: 'reclaimEscrow',
        amount: props.maxAmount,
        shares: props.maxShares,
        validator: props.address,
      }),
    )
  }

  /**
   * `<input max="9000000000.111111111">` warns about <=9000000000.11111 so we
   * round up to `<input max="9000000000.11112">`
   */
  const roundedUpStringifiedFloatMaxAmount = new BigNumber(props.maxAmount)
    .shiftedBy(-9) // / 10 ** 9
    .toPrecision(15, BigNumber.ROUND_UP)

  return (
    <Form onSubmit={submit}>
      <Box direction="row" gap="small" pad={{ top: 'small' }}>
        <Box background="background-front">
          <Box width="small">
            <TextInput
              data-testid="amount"
              id="amount-id"
              name="amount"
              placeholder={t('common.amount')}
              type="number"
              step="any"
              min="0"
              max={roundedUpStringifiedFloatMaxAmount}
              size="medium"
              value={amount}
              onChange={event => amountChanged(event.target.value)}
              required
            />
          </Box>
        </Box>
        <Button label={t('account.reclaimEscrow.reclaim', 'Reclaim')} type="submit" primary />
        <Button label={t('account.reclaimEscrow.reclaimAll', 'Reclaim all')} onClick={reclaimAll} />
      </Box>
      {shares > 0 && (
        <Text size="small" data-testid="numberOfShares">
          {t('account.reclaimEscrow.convertedToShares', 'Corresponding number of gigashares: {{shares}}', {
            shares,
          })}
        </Text>
      )}
      <TransactionStatus error={error} success={success} />
    </Form>
  )
})
