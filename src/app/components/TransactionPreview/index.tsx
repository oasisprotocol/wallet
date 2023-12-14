/**
 *
 * TransactionPreview
 *
 */
import { Box } from 'grommet/es6/components/Box'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { memo, useContext } from 'react'
import { Text } from 'grommet/es6/components/Text'
import { AmountFormatter } from '../AmountFormatter'
import { AddressPreviewRow, PreviewRow } from '../ResponsiveGridRow'
import { TransactionPreview as Preview } from 'app/state/transaction/types'
import { useTranslation } from 'react-i18next'
import { TransactionTypeFormatter } from '../TransactionTypeFormatter'

interface Props {
  preview: Preview
  walletAddress: string
  chainContext: string
}

export const TransactionPreview = memo((props: Props) => {
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'
  const { preview, walletAddress, chainContext } = props

  return (
    <Box gap={isMobile ? 'medium' : 'xsmall'}>
      <PreviewRow
        label={t('transaction.preview.type', 'Type')}
        value={<TransactionTypeFormatter type={preview.transaction.type} />}
      />
      <AddressPreviewRow label={t('transaction.preview.from', 'From')} value={walletAddress} />
      {preview.transaction.type === 'transfer' && (
        <AddressPreviewRow label={t('transaction.preview.to', 'To')} value={preview.transaction.to} />
      )}
      {(preview.transaction.type === 'addEscrow' || preview.transaction.type === 'reclaimEscrow') && (
        <AddressPreviewRow
          label={t('transaction.preview.validator', 'Validator')}
          value={preview.transaction.validator}
        />
      )}
      <PreviewRow
        label={t('transaction.preview.amount', 'Amount')}
        value={<AmountFormatter amount={preview.transaction.amount} size="inherit" />}
      />
      {preview.transaction.type === 'reclaimEscrow' && (
        <PreviewRow
          label={t('transaction.preview.shares', 'Gigashares')}
          value={<AmountFormatter amount={preview.transaction.shares} hideTicker />}
        />
      )}
      <PreviewRow
        label={t('transaction.preview.fee', 'Fee')}
        value={<AmountFormatter amount={preview.fee!} size="inherit" />}
      />
      <PreviewRow label={t('transaction.preview.gas', 'Gas')} value={preview.gas} />
      <PreviewRow
        label={t('transaction.preview.genesisHash', 'Genesis hash')}
        value={
          <Box
            border={{
              color: 'background-contrast-2',
              side: 'left',
              size: '6px',
            }}
            background={{
              color: 'background-contrast',
              opacity: 0.04,
            }}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          >
            <Text color="grayMedium" size="small" style={{ fontFamily: 'Roboto mono', letterSpacing: 0 }}>
              {chainContext}
            </Text>
          </Box>
        }
      />
    </Box>
  )
})
