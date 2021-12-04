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
  New,
  ShareOption,
  Transaction as TxIcon,
} from 'grommet-icons/icons'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { OperationsRow } from 'vendors/explorer'

import { AmountFormatter } from '../AmountFormatter'
import { DateFormatter } from '../DateFormatter'
import { ShortAddress } from '../ShortAddress'
import { InfoBox } from './InfoBox'

export enum TransactionSide {
  Sent = 'sent',
  Received = 'received',
}

/**
 * These are manually copied from Oasis-explorer. Later, oasis-explorer should
 * make those an enum so that we maintain strong typing across projects.
 */
export enum TransactionType {
  Transfer = 'transfer',
  AddEscrow = 'addescrow',
  ReclaimEscrow = 'reclaimescrow',
}

type TransactionDictionary = {
  [type in TransactionType]: {
    [side in TransactionSide]: {
      icon: () => React.ReactNode
      header: () => React.ReactNode
      designation: string
    }
  }
}

interface TransactionProps {
  referenceAddress: string
  transaction: OperationsRow
}

export function Transaction(props: TransactionProps) {
  const { t } = useTranslation()
  const transaction = props.transaction
  const referenceAddress = props.referenceAddress
  const amount = (
    <AmountFormatter
      amount={transaction.escrow_amount ?? transaction.reclaim_escrow_amount ?? transaction.amount!}
    />
  )

  let side: TransactionSide
  let otherAddress = ''

  if (transaction.from === referenceAddress) {
    side = TransactionSide.Sent
    otherAddress = transaction.to!
  } else {
    side = TransactionSide.Received
    otherAddress = transaction.from!
  }

  // @TODO: This could probably cleverly be moved outside of the component
  //for better readability and marginal performance gain, but for now
  //the translation keys need to be read by i18next extraction
  const transactionDictionary: TransactionDictionary = {
    [TransactionType.Transfer]: {
      [TransactionSide.Received]: {
        designation: t('common.from', 'From'),
        icon: () => <TxIcon />,
        header: () => (
          <Trans
            i18nKey="account.transaction.transfer.received"
            t={t}
            components={[amount]}
            defaults="Received <0></0>"
          />
        ),
      },
      [TransactionSide.Sent]: {
        designation: t('common.to', 'To'),
        icon: () => <TxIcon />,
        header: () => (
          <Trans
            i18nKey="account.transaction.transfer.sent.header"
            t={t}
            components={[amount]}
            defaults="Sent <0></0>"
          />
        ),
      },
    },
    [TransactionType.AddEscrow]: {
      [TransactionSide.Received]: {
        designation: t('common.delegator', 'Delegator'),
        icon: () => <Money />,
        header: () => (
          <Trans
            i18nKey="account.transaction.addEscrow.received"
            t={t}
            components={[amount]}
            defaults="Received <0></0> delegation in escrow"
          />
        ),
      },
      [TransactionSide.Sent]: {
        designation: t('common.validator', 'Validator'),
        icon: () => <Money />,
        header: () => (
          <Trans
            i18nKey="account.transaction.addEscrow.sent"
            t={t}
            components={[amount]}
            defaults="Delegated <0></0> to validator"
          />
        ),
      },
    },
    [TransactionType.ReclaimEscrow]: {
      [TransactionSide.Received]: {
        designation: t('common.delegator', 'Delegator'),
        icon: () => <Money />,
        header: () => (
          <Trans
            i18nKey="account.transaction.reclaimEscrow.received"
            t={t}
            components={[amount]}
            defaults="<0></0> reclaimed by delegator"
          />
        ),
      },
      [TransactionSide.Sent]: {
        designation: t('common.validator', 'Validator'),
        icon: () => <Money />,
        header: () => (
          <Trans
            i18nKey="account.transaction.reclaimEscrow.sent"
            t={t}
            components={[amount]}
            defaults="Reclaimed <0></0> from validator"
          />
        ),
      },
    },
  }

  const unrecognizedTransaction: TransactionDictionary[TransactionType][TransactionSide] = {
    designation: t('account.otherTransaction.designation', 'Other address'),
    icon: () => <New />,
    header: () => (
      <Trans
        i18nKey="account.otherTransaction.header"
        t={t}
        components={[transaction.type]}
        defaults="Unrecognized transaction, type '<0></0>'"
      />
    ),
  }

  const isTypeRecognized = (type: string | undefined): type is TransactionType =>
    type ? type in transactionDictionary : false

  const matchingConfiguration = isTypeRecognized(transaction.type)
    ? transactionDictionary[transaction.type][side]
    : unrecognizedTransaction

  const icon = matchingConfiguration.icon()
  const header = matchingConfiguration.header()
  const designation = matchingConfiguration.designation

  return (
    <Card round="small" background="background-front" gap="none" elevation="xsmall">
      <CardHeader pad={{ horizontal: 'medium', vertical: 'small' }} gap="none" background="brand" wrap={true}>
        <Box direction="row" gap="small">
          {icon}
          <Text>{header}</Text>
        </Box>
      </CardHeader>
      <CardBody pad={{ horizontal: 'none', vertical: 'none' }}>
        <Grid columns={{ count: 'fit', size: 'xsmall' }} gap="none">
          <InfoBox icon={<Money color="brand" />} label={t('common.amount', 'Amount')} value={amount} />
          <NavLink to={`/account/${otherAddress}`}>
            <InfoBox
              icon={<ContactInfo color="brand" />}
              label={designation}
              value={<ShortAddress address={otherAddress} />}
            />
          </NavLink>
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
