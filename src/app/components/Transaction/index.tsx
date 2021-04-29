/**
 *
 * Transaction
 *
 */
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Grid, Text } from 'grommet'
import {
  CircleInformation,
  ContactInfo,
  Cube,
  Money,
  ShareOption,
  Transaction as TxIcon,
} from 'grommet-icons/icons'
import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { OperationsRow } from 'vendors/explorer'

import { AmountFormatter } from '../AmountFormatter'
import { DateFormatter } from '../DateFormatter'
import { ShortAddress } from '../ShortAddress'

interface DetailProps {
  icon?: React.ReactNode
  label: string
  value: string | React.ReactNode
  link?: string
}

function InfoBox(props: DetailProps) {
  const history = useHistory()
  const boxClicked = () => {
    if (props.link) {
      history.push(props.link)
    }
  }

  return (
    <Box
      direction="row"
      gap="small"
      hoverIndicator={{ color: 'light-3' }}
      onClick={() => boxClicked()}
      pad="medium"
    >
      {props.icon && (
        <Box fill="vertical" align="center" justify="center" alignSelf="center" pad={{ right: 'xsmall' }}>
          {props.icon}
        </Box>
      )}
      <Box justify="center">
        <Text weight="bold">{props.label}</Text>
        <Text>{props.value}</Text>
      </Box>
    </Box>
  )
}

export enum TransactionType {
  RECEIVED,
  SENT,
  STAKED,
  UNSTAKED,
}

interface TransactionProps {
  referenceAddress: string
  transaction: OperationsRow
}

export function Transaction(props: TransactionProps) {
  const { t } = useTranslation()
  const transaction = props.transaction
  const referenceAddress = props.referenceAddress
  const amount = <AmountFormatter amount={transaction.amount!} />
  let type: TransactionType

  let otherAddressDesignator = '',
    otherAddress

  if (transaction.from === referenceAddress) {
    type = TransactionType.SENT
    otherAddressDesignator = t('account.transaction.sent.designator', 'To')
    otherAddress = transaction.to!
  } else {
    type = TransactionType.RECEIVED
    otherAddressDesignator = t('account.transaction.received.designator', 'From')
    otherAddress = transaction.from!
  }

  return (
    <Card
      round="small"
      // pad="small"
      background="background-front"
      gap="none"
      elevation="xsmall"
    >
      <CardHeader pad={{ horizontal: 'medium', vertical: 'small' }} gap="none" background="brand" wrap={true}>
        <Box direction="row" gap="small">
          <TxIcon />
          <Text>
            {type === TransactionType.SENT && (
              <Trans
                i18nKey="account.transaction.sent.header"
                t={t}
                components={[amount]}
                defaults="Sent <0></0>"
              />
            )}
            {type === TransactionType.RECEIVED && (
              <Trans
                i18nKey="account.transaction.received.header"
                t={t}
                components={[amount]}
                defaults="Received <0></0>"
              />
            )}
          </Text>
        </Box>
      </CardHeader>
      <CardBody pad={{ horizontal: 'none', vertical: 'none' }}>
        <Grid columns={{ count: 'fit', size: 'xsmall' }} gap="none">
          <InfoBox icon={<Money color="brand" />} label={t('common.amount', 'Amount')} value={amount} />
          <InfoBox
            icon={<ContactInfo color="brand" />}
            label={otherAddressDesignator}
            value={<ShortAddress address={otherAddress} />}
            link={`/account/${otherAddress}`}
          />
          <InfoBox
            icon={<Cube color="brand" />}
            label={t('common.block', 'Block')}
            value={transaction.level}
          />
        </Grid>
      </CardBody>
      <CardFooter background="background-contrast" pad={{ horizontal: 'medium' }}>
        <Text size="small">
          <DateFormatter date={transaction.timestamp!} />
        </Text>
        <Box direction="row">
          <Button icon={<CircleInformation color="dark-3" />} hoverIndicator />
          <Button icon={<ShareOption color="dark-3" />} hoverIndicator />
        </Box>
      </CardFooter>
    </Card>
  )
}
