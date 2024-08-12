/**
 *
 * DelegationList
 *
 */
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { stakingActions } from 'app/state/staking'
import { selectSelectedAddress, selectValidatorDetails } from 'app/state/staking/selectors'
import { DebondingDelegation, Delegation } from 'app/state/staking/types'
import { Down } from 'grommet-icons/es6/icons/Down'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { dataTableCustomStyles } from 'styles/theme/dataTableTheme'
import { TypeSafeDataTable, ITypeSafeDataTableColumn } from 'types/TypeSafeDataTable'
import { isWebUri } from 'valid-url'
import { DelegationItem } from './DelegationItem'
import { AmountCell, FeeCell, IconCell, NameCell, StatusCell, TimeEndCell } from '../TableCell'

type Props =
  | {
      type: 'active'
      delegations: Delegation[]
    }
  | {
      type: 'debonding'
      delegations: DebondingDelegation[]
    }

/**
 * Renders the list of delegations
 */
export const DelegationList = memo((props: Props) => {
  const type = props.type

  // Create a combined unique key because validatorAddress is not unique in debondings
  const delegations = props.delegations.map(delegation => ({
    ...delegation,
    uniqueKey:
      type === 'active'
        ? delegation.validatorAddress
        : `${delegation.validatorAddress}+${(delegation as DebondingDelegation).epoch}`,
  }))

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const validatorDetails = useSelector(selectValidatorDetails)
  const selectedAddress = useSelector(selectSelectedAddress)

  const isAddressInWallet = useSelector(selectIsAddressInWallet)
  const canReclaim = type === 'active' && isAddressInWallet

  const rowClicked = (row: Delegation | DebondingDelegation) => {
    if (selectedAddress === row.validatorAddress) {
      dispatch(stakingActions.validatorDeselected())
    } else {
      dispatch(stakingActions.validatorSelected(row.validatorAddress))
    }
  }

  const columnTypes: Record<
    'icon' | 'status' | 'name' | 'amount' | 'fee' | 'debondingTimeEnd',
    ITypeSafeDataTableColumn<Delegation>
  > = {
    icon: {
      name: '',
      id: 'icon',
      cell: datum =>
        datum.validator?.media?.logotype &&
        isWebUri(datum.validator?.media.logotype) && (
          <IconCell onClick={() => rowClicked(datum)} src={datum.validator?.media.logotype} />
        ),
      width: '34px',
    },
    status: {
      name: '',
      id: 'status',
      cell: datum =>
        datum.validator && <StatusCell onClick={() => rowClicked(datum)} status={datum.validator.status} />,
      width: '34px',
    },
    name: {
      name: t('validator.name', 'Name'),
      id: 'name',
      selector: 'name',
      maxWidth: '40ex',
      minWidth: '15ex',
      cell: datum =>
        datum.validator?.name ?? (
          <NameCell address={datum.validatorAddress} onClick={() => rowClicked(datum)} />
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
      width: '28ex',
      right: true,
      cell: datum =>
        datum.amount && (
          <AmountCell
            amount={datum.amount}
            onClick={() => rowClicked(datum)}
            maximumFractionDigits={2}
            minimumFractionDigits={2}
          />
        ),
      sortable: true,
      sortFunction: (row1, row2) => Number(BigInt(row1.amount) - BigInt(row2.amount)),
    },
    fee: {
      name: t('validator.fee', 'Fee'),
      id: 'fee',
      selector: 'fee',
      width: '100px',
      right: true,
      hide: 'sm',
      cell: datum => <FeeCell fee={datum.validator?.current_rate} onClick={() => rowClicked(datum)} />,

      sortable: true,
      sortFunction: (row1, row2) => (row1.validator?.current_rate ?? 0) - (row2.validator?.current_rate ?? 0),
    },
    debondingTimeEnd: {
      name: t('delegations.debondingTimeEnd', 'End of debonding'),
      id: 'debondingTimeEnd',
      selector: 'epoch',
      sortable: true,
      cell: datum => (
        <TimeEndCell epoch={(datum as DebondingDelegation).epoch} onClick={() => rowClicked(datum)} />
      ),
    },
  }

  const columns =
    type === 'active'
      ? [columnTypes.icon, columnTypes.status, columnTypes.name, columnTypes.amount, columnTypes.fee]
      : [columnTypes.icon, columnTypes.name, columnTypes.amount, columnTypes.debondingTimeEnd]

  const defaultSortField: undefined | keyof DebondingDelegation = type === 'active' ? undefined : 'epoch'

  return (
    <TypeSafeDataTable
      noHeader={true}
      noDataComponent={
        type === 'active'
          ? t(
              'account.emptyActiveDelegationsList',
              'There are currently no active delegations for this account.',
            )
          : t('account.emptyDebondingDelegationsList', 'There are no debonding delegations for this account.')
      }
      columns={columns}
      data={delegations}
      defaultSortField={defaultSortField}
      keyField="uniqueKey"
      style={{}}
      customStyles={dataTableCustomStyles}
      expandableRowsHideExpander
      expandableRows={true}
      expandableRowsComponent={
        <DelegationItem
          data={{} as any}
          validatorDetails={validatorDetails}
          canReclaim={canReclaim}
          type={type}
        />
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
