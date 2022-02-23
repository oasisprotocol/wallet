/**
 *
 * DelegationList
 *
 */
import { AmountFormatter } from 'app/components/AmountFormatter'
import { ShortAddress } from 'app/components/ShortAddress'
import { selectAccountAddress } from 'app/state/account/selectors'
import { useStakingSlice } from 'app/state/staking'
import { selectSelectedAddress, selectValidatorDetails } from 'app/state/staking/selectors'
import { Delegation } from 'app/state/staking/types'
import { selectActiveWallet } from 'app/state/wallet/selectors'
import { Text } from 'grommet'
import { Down, StatusCritical, StatusGood } from 'grommet-icons'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { dataTableStyles } from 'styles/theme/ThemeProvider'
import { TypeSafeDataTable, ITypeSafeDataTableColumn } from 'types/TypeSafeDataTable'
import { isWebUri } from 'valid-url'

import { DelegationItem } from './DelegationItem'

interface Props {
  type: 'active' | 'debonding'
  delegations: Delegation[]
}

/**
 * Renders the list of delegations
 */
export const DelegationList = memo((props: Props) => {
  const type = props.type
  const delegations = props.delegations

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const actions = useStakingSlice().actions

  const validatorDetails = useSelector(selectValidatorDetails)
  const selectedAddress = useSelector(selectSelectedAddress)

  const accountAddress = useSelector(selectAccountAddress)
  const activeWallet = useSelector(selectActiveWallet)
  const canReclaim = type === 'active' && activeWallet?.address === accountAddress

  const rowClicked = (row: Delegation) => {
    if (selectedAddress === row.validatorAddress) {
      dispatch(actions.validatorDeselected())
    } else {
      dispatch(actions.validatorSelected(row.validatorAddress))
    }
  }

  // All possible columns
  const columnTypes: Record<
    'icon' | 'status' | 'name' | 'amount' | 'fee' | 'epoch',
    ITypeSafeDataTableColumn<Delegation>
  > = {
    icon: {
      name: '',
      id: 'icon',
      cell: datum =>
        datum.validator?.media?.logotype &&
        isWebUri(datum.validator?.media.logotype) && (
          <img src={datum.validator?.media.logotype} loading="lazy" className={'logotype-small'} alt="" />
        ),
      width: '34px',
    },
    status: {
      name: '',
      id: 'status',
      cell: datum =>
        datum.validator && datum.validator.status === 'active' ? (
          <StatusGood color="status-ok" />
        ) : (
          <StatusCritical color="status-critical" />
        ),
      width: '34px',
    },
    name: {
      name: t('validator.name', 'Name'),
      id: 'name',
      selector: 'name',
      cell: datum =>
        datum.validator?.name ?? (
          <Text data-tag="allowRowEvents">
            <ShortAddress address={datum.validatorAddress} />
          </Text>
        ),
      sortable: true,
      sortFunction: (row1, row2) =>
        (row1.validator?.name ?? row1.validatorAddress).localeCompare(
          row2.validator?.name ?? row2.validatorAddress,
        ),
    },
    amount: {
      name:
        type === 'active'
          ? t('delegations.delegatedAmount', 'Delegated amount')
          : t('delegations.reclaimedAmount', 'Amount to reclaim'),
      id: 'amount',
      selector: 'amount',
      cell: datum =>
        datum.amount && (
          <AmountFormatter amount={datum.amount} minimumFractionDigits={1} maximumFractionDigits={4} />
        ),
      sortable: true,
      sortFunction: (row1, row2) => Number(row1.amount) - Number(row2.amount),
    },
    fee: {
      name: t('validator.fee', 'Fee'),
      id: 'fee',
      selector: 'fee',
      width: '100px',
      cell: datum =>
        datum.validator?.current_rate !== undefined ? `${datum.validator.current_rate * 100}%` : 'Unknown',
      sortable: true,
      sortFunction: (row1, row2) => (row1.validator?.current_rate ?? 0) - (row2.validator?.current_rate ?? 0),
    },
    epoch: {
      name: t('delegations.debondingEpoch', 'Debonding Epoch'),
      id: 'epoch',
      selector: 'epoch',
      sortable: true,
      // width: '120px',
      // cell: datum => (datum.validator?.fee !== undefined ? `${datum.validator.fee}%` : 'Unknown'),
    },
  }

  const columns =
    type === 'active'
      ? [columnTypes.icon, columnTypes.status, columnTypes.name, columnTypes.amount, columnTypes.fee]
      : [columnTypes.icon, columnTypes.name, columnTypes.amount, columnTypes.epoch]

  return (
    <TypeSafeDataTable
      noHeader={true}
      columns={columns}
      data={delegations}
      keyField="validatorAddress"
      style={{}}
      customStyles={dataTableStyles}
      expandableRowsHideExpander
      expandableRows={true}
      expandableRowsComponent={
        <DelegationItem data={{} as any} validatorDetails={validatorDetails} canReclaim={canReclaim} />
      }
      expandableRowExpanded={row => row.validatorAddress === selectedAddress}
      sortIcon={<Down />}
      theme="blank"
      onRowClicked={rowClicked}
      highlightOnHover
      pointerOnHover
    />
  )
})
