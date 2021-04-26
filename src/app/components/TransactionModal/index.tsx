import { transactionActions } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import { TransactionStep } from 'app/state/transaction/types'
import { selectAddress, selectBalance } from 'app/state/wallet/selectors'
import { Box, Button, Grid, Heading, Layer, ResponsiveContext, Spinner, Text } from 'grommet'
import { Checkmark, Close } from 'grommet-icons/icons'
import * as React from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AmountFormatter } from '../AmountFormatter'
import { PrettyAddress } from '../PrettyAddress'

interface Props {}

/**
 *
 * TransactionModal
 *
 * Takes a transaction payload as input - then through the modal :
 *
 * - Review the transaction (Display the raw body)
 * - Submit
 * - If ledger, display a loader and a message telling to sign on ledger
 * - Display transaction sent
 *
 */
export function TransactionModal(props: Props) {
  const { t } = useTranslation()
  const { transaction, step } = useSelector(selectTransaction)
  const walletAddress = useSelector(selectAddress)
  const balance = useSelector(selectBalance)

  if (!balance) {
    throw new Error('No balance found for wallet')
  }

  const dispatch = useDispatch()
  const size = useContext(ResponsiveContext)

  const abortTransaction = () => {
    dispatch(transactionActions.abortTransaction())
  }
  const confirmTransaction = () => {
    dispatch(transactionActions.confirmTransaction())
  }

  return (
    <Layer position="center">
      <Box pad="medium" gap="medium" width="680px">
        {step === TransactionStep.Preview && (
          <Box>
            <Heading level="2" margin="none">
              {t('transaction.step.preview', 'Preview transaction')}
            </Heading>
            <Box
              border={{
                color: 'status-warning',
                side: 'left',
                size: '3px',
              }}
              background={{
                color: 'status-warning',
                opacity: 0.2,
              }}
              margin={{ vertical: 'small' }}
              pad="xsmall"
            >
              <Text>
                {t(
                  'transaction.preview.warning',
                  'Once you confirm this transaction you will not be able to cancel it. Carefully review it, and confirm once you are sure that you want to send it.',
                )}
              </Text>
            </Box>
            <Grid
              columns={size !== 'small' ? ['auto', 'auto'] : ['auto']}
              gap={{ column: 'small', row: 'xsmall' }}
            >
              <Box>
                <Text weight="bold">{t('transaction.preview.type', 'Type')} :</Text>
              </Box>
              <Box>Transfer</Box>
              <Box>
                <Text weight="bold">{t('transaction.preview.from', 'From')} :</Text>
              </Box>
              <Box>
                <PrettyAddress address={walletAddress} />
              </Box>
              <Box>
                <Text weight="bold">{t('transaction.preview.to', 'To')} :</Text>
              </Box>
              <Box>
                <PrettyAddress address={transaction!.to!} />
              </Box>
              <Box>
                <Text weight="bold">{t('transaction.preview.amount', 'Amount')} :</Text>
              </Box>
              <Box>
                <AmountFormatter amount={transaction!.amount! * 10 ** 9} />
              </Box>
              <Box>
                <Text weight="bold">{t('transaction.preview.balance', 'Balance')} :</Text>
              </Box>
              <Box>
                <AmountFormatter amount={balance.available} />
              </Box>
            </Grid>
            <Box direction="row" gap="small" alignSelf="end" pad={{ top: 'large' }}>
              <Button
                secondary
                label={t('transaction.abort', 'Abort')}
                style={{ borderRadius: '4px' }}
                icon={<Close size="18px" />}
                onClick={abortTransaction}
              />
              <Button
                primary
                label={t('transaction.confirm', 'Confirm')}
                onClick={confirmTransaction}
                icon={<Checkmark size="18px" />}
                style={{ borderRadius: '4px' }}
                alignSelf="end"
              />
            </Box>
          </Box>
        )}
        {step === TransactionStep.Signing && (
          <Box direction="row" align="center" gap="medium">
            <Spinner size="medium" />
            <Text size="large">{t('transaction.step.signing', 'Signing transaction')}</Text>
          </Box>
        )}
        {step === TransactionStep.Submitting && (
          <Box direction="row" align="center" gap="medium">
            <Spinner size="medium" />
            <Text size="large">{t('transaction.step.submitting', 'Submitting transaction')}</Text>
          </Box>
        )}
      </Box>
    </Layer>
  )
}
