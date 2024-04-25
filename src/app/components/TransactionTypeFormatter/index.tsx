import { NewTransactionType } from 'app/state/transaction/types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'grommet/es6/components/Text'

interface Props {
  type: NewTransactionType
}

export const TransactionTypeFormatter = memo((props: Props) => {
  const { t } = useTranslation()
  const type = props.type

  const typeMap: { [type in NewTransactionType]: string } = {
    addEscrow: t('transaction.types.addEscrow', 'delegating your tokens to a validator and generate rewards'),
    reclaimEscrow: t('transaction.types.reclaimEscrow', 'reclaiming your tokens delegated to a validator'),
    transfer: t('transaction.types.transfer', 'sending tokens from your account to another'),
  }

  const typeMessage = typeMap[type]
  return (
    <span>
      <Text color="grayMedium" size="small" style={{ textTransform: 'capitalize', fontWeight: 600 }}>
        {type}
      </Text>
      <Text color="grayMedium" size="xsmall" style={{ letterSpacing: 0 }}>
        &nbsp;({typeMessage})
      </Text>
    </span>
  )
})
