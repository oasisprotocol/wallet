import { FC, ReactNode } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { StringifiedBigInt } from '../../../../types/StringifiedBigInt'
import { formatCommissionPercent } from '../../../lib/helpers'
import { ShortAddress } from '../../../components/ShortAddress'
import { AmountFormatter } from '../../..//components/AmountFormatter'
import { ValidatorStatus } from './ValidatorList/ValidatorStatus'

interface ExpandableCellProps {
  children: ReactNode
  onClick: () => void
}

/**
 * Helper component for react-data-table-component custom cells
 *
 * react-data-table-component handles expandableRows correctly only for text nodes
 * or it requires to apply data-tag="allowRowEvents" to the innermost element which is hard to control
 */
export const ExpandableCell: FC<ExpandableCellProps> = ({ children, onClick }) => {
  return (
    <Box onClick={onClick} style={{ display: 'inline', boxShadow: 'none' }}>
      {children}
    </Box>
  )
}

interface IconCellProps {
  onClick: () => void
  src: string
}

export const IconCell: FC<IconCellProps> = ({ onClick, src }) => {
  return (
    <ExpandableCell onClick={onClick}>
      <img src={src} loading="lazy" className={'logotype-small'} alt="" />
    </ExpandableCell>
  )
}

interface StatusCellProps {
  onClick: () => void
  status: 'active' | 'inactive' | 'unknown'
}

export const StatusCell: FC<StatusCellProps> = ({ onClick, status }) => {
  return (
    <ExpandableCell onClick={onClick}>
      <ValidatorStatus status={status} showLabel={false}></ValidatorStatus>
    </ExpandableCell>
  )
}

interface NameCellProps {
  address: string
  onClick: () => void
}

export const NameCell: FC<NameCellProps> = ({ address, onClick }) => {
  return (
    <ExpandableCell onClick={onClick}>
      <Text>
        <ShortAddress address={address} />
      </Text>
    </ExpandableCell>
  )
}

interface AmountCellProps {
  amount: StringifiedBigInt
  onClick: () => void
}

export const AmountCell: FC<AmountCellProps> = ({ amount, onClick }) => {
  return (
    <ExpandableCell onClick={onClick}>
      <AmountFormatter amount={amount} minimumFractionDigits={0} maximumFractionDigits={0} />
    </ExpandableCell>
  )
}

interface FeeCellProps {
  fee: number | undefined
  onClick: () => void
}

export const FeeCell: FC<FeeCellProps> = ({ fee, onClick }) => {
  return (
    <ExpandableCell onClick={onClick}>
      {fee !== undefined ? <span>{`${formatCommissionPercent(fee)}%`}</span> : <span>Unknown</span>}
    </ExpandableCell>
  )
}
