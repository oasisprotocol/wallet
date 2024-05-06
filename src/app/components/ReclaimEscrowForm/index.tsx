/**
 *
 * ReclaimEscrowForm
 *
 */
import { formatBaseUnitsAsRose, parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import { transactionActions } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import BigNumber from 'bignumber.js'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { Text } from 'grommet/es6/components/Text'
import { TextInput } from 'grommet/es6/components/TextInput'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import React, { memo, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { TransactionStatus } from '../TransactionStatus'
import { selectTicker } from '../../state/network/selectors'
import { AmountFormatter } from '../AmountFormatter'

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
  const ticker = useSelector(selectTicker)
  const [amount, setAmount] = useState('')
  const [shares, setShares] = useState('0' as StringifiedBigInt)
  const dispatch = useDispatch()
  const isMobile = useContext(ResponsiveContext) === 'small'

  useEffect(() => {
    return () => {
      dispatch(transactionActions.clearTransaction())
    }
  }, [dispatch])

  const amountChanged = (amount: string) => {
    const shares = (
      (BigInt(parseRoseStringToBaseUnitString(amount || '0')) * BigInt(props.maxShares)) /
      BigInt(props.maxAmount)
    ).toString()
    setAmount(amount)
    setShares(shares)
  }

  const submit = () => {
    dispatch(
      transactionActions.reclaimEscrow({
        type: 'reclaimEscrow',
        amount: parseRoseStringToBaseUnitString(amount),
        shares: shares,
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
      <Box direction={isMobile ? 'column' : 'row'} gap="medium" pad={{ top: 'small' }}>
        <Box>
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
            icon={
              <Text size="xsmall" weight={600} color="ticker">
                {ticker}
              </Text>
            }
            reverse
          />
          <Box align="end" margin={{ top: 'xsmall' }}>
            <Text weight="bolder" size="small">
              <span>{t('account.reclaimEscrow.reclaimableAmount', 'Available:')} </span>
              <AmountFormatter amount={props.maxAmount} smallTicker />
            </Text>
          </Box>
        </Box>
        <Box direction="row" gap="medium" height="50px">
          <Box fill={isMobile}>
            <Button fill label={t('account.reclaimEscrow.reclaim', 'Reclaim')} type="submit" primary />
          </Box>
          <Box fill={isMobile}>
            <Button fill label={t('account.reclaimEscrow.reclaimAll', 'Reclaim all')} onClick={reclaimAll} />
          </Box>
        </Box>
      </Box>
      {shares !== '0' && (
        <Text size="small" data-testid="numberOfShares">
          {t('account.reclaimEscrow.convertedToShares', 'Corresponding number of gigashares: {{shares}}', {
            shares: formatBaseUnitsAsRose(shares),
          })}
        </Text>
      )}
      <TransactionStatus error={error} success={success} />
    </Form>
  )
})
