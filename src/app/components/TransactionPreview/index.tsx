/**
 *
 * TransactionPreview
 *
 */
import { Box, Grid, ResponsiveContext, Text } from 'grommet'
import React, { memo, useContext } from 'react'

import { AmountFormatter } from '../AmountFormatter'
import { PrettyAddress } from '../PrettyAddress'
import { ResponsiveGridRow } from '../ResponsiveGridRow'
import { TransactionPreview as Preview } from 'app/state/transaction/types'
import { useTranslation } from 'react-i18next'

interface Props {
  preview: Preview
  walletAddress: string
  chainContext: string
}

export const TransactionPreview = memo((props: Props) => {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)
  const { preview, walletAddress, chainContext } = props
  const isMobile = React.useContext(ResponsiveContext) === 'small'

  return (
    <Grid columns={size !== 'small' ? ['auto', 'auto'] : ['auto']} gap={{ column: 'small', row: 'xsmall' }}>
      <ResponsiveGridRow
        label={t('transaction.preview.from', 'From')}
        value={
          <Text style={{ fontFamily: 'Roboto mono' }} size={isMobile ? '16px' : 'medium'}>
            <PrettyAddress address={walletAddress} />
          </Text>
        }
      />
      {preview.transaction.type === 'transfer' && (
        <ResponsiveGridRow
          label={t('transaction.preview.to', 'To')}
          value={
            <Text style={{ fontFamily: 'Roboto mono' }} size={isMobile ? '16px' : 'medium'}>
              <PrettyAddress address={preview.transaction.to} />
            </Text>
          }
          withSeparator
        />
      )}
      {(preview.transaction.type === 'addEscrow' || preview.transaction.type === 'reclaimEscrow') && (
        <ResponsiveGridRow
          label={t('transaction.preview.validator', 'Validator')}
          value={
            <Text style={{ fontFamily: 'Roboto mono' }} size={isMobile ? '16px' : 'medium'}>
              <PrettyAddress address={preview.transaction.validator} />
            </Text>
          }
          withSeparator
        />
      )}
      <ResponsiveGridRow
        label={t('transaction.preview.amount', 'Amount')}
        value={<AmountFormatter amount={preview.transaction.amount} smallTicker />}
      />
      {preview.transaction.type === 'reclaimEscrow' && (
        <ResponsiveGridRow
          label={t('transaction.preview.shares', 'Gigashares')}
          value={<AmountFormatter amount={preview.transaction.shares} hideTicker />}
        />
      )}
      <ResponsiveGridRow
        label={t('transaction.preview.fee', 'Fee')}
        value={<AmountFormatter amount={preview.fee!} smallTicker />}
      />
      <ResponsiveGridRow
        label={t('transaction.preview.gas', 'Gas')}
        value={<AmountFormatter amount={preview.gas!} hideTicker />}
        withSeparator
      />
      <ResponsiveGridRow
        label={t('transaction.preview.genesisHash', 'Genesis hash')}
        value={
          <Box
            border={{
              color: 'background-contrast-2',
              side: 'left',
              size: '3px',
            }}
            background={{
              color: 'background-contrast',
              opacity: 0.04,
            }}
            pad="small"
          >
            {chainContext}
          </Box>
        }
      />
    </Grid>
  )
})
