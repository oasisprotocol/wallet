/**
 *
 * ValidatorList
 *
 */
import { AmountFormatter } from 'app/components/AmountFormatter'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { ShortAddress } from 'app/components/ShortAddress'
import { ValidatorStatus } from 'app/pages/StakingPage/Features/ValidatorList/ValidatorStatus'
import { stakingActions } from 'app/state/staking'
import {
  selectSelectedAddress,
  selectUpdateValidatorsError,
  selectValidatorDetails,
  selectValidators,
  selectValidatorsTimestamp,
} from 'app/state/staking/selectors'
import { Validator } from 'app/state/staking/types'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { Box, Text } from 'grommet'
import { Down } from 'grommet-icons/icons'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { dataTableStyles } from 'styles/theme/ThemeProvider'
import { TypeSafeDataTable, ITypeSafeDataTableColumn } from 'types/TypeSafeDataTable'
import { isWebUri } from 'valid-url'

import { ValidatorItem } from './ValidatorItem'

interface Props {}

export const ValidatorList = memo((props: Props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const validators = useSelector(selectValidators)
  const validatorsTimestamp = useSelector(selectValidatorsTimestamp)
  const updateValidatorsError = useSelector(selectUpdateValidatorsError)
  const isAddressInWallet = useSelector(selectIsAddressInWallet)
  const selectedAddress = useSelector(selectSelectedAddress)
  const validatorDetails = useSelector(selectValidatorDetails)

  const rowClicked = (row: Validator) => {
    if (selectedAddress === row.address) {
      dispatch(stakingActions.validatorDeselected())
    } else {
      dispatch(stakingActions.validatorSelected(row.address))
    }
  }

  const columns: ITypeSafeDataTableColumn<Validator>[] = [
    {
      name: '',
      id: 'icon',
      cell: datum =>
        datum.media?.logotype &&
        isWebUri(datum.media.logotype) && (
          <img src={datum.media.logotype} loading="lazy" className={'logotype-small'} alt="" />
        ),
      width: '34px',
    },
    {
      name: '',
      id: 'status',
      cell: datum => <ValidatorStatus status={datum.status} showLabel={false}></ValidatorStatus>,
      width: '34px',
    },
    {
      name: t('validator.name', 'Name'),
      id: 'name',
      selector: 'name',
      cell: datum =>
        datum.name ?? (
          <Text data-tag="allowRowEvents">
            <ShortAddress address={datum.address} />
          </Text>
        ),
      sortable: true,
      sortFunction: (row1, row2) => (row1.name ?? row1.address).localeCompare(row2.name ?? row2.address),
    },
    {
      name: t('validator.escrow', 'Escrow'),
      id: 'escrow',
      selector: 'escrow',
      hide: 'sm',
      cell: datum => (
        <AmountFormatter amount={datum.escrow} minimumFractionDigits={0} maximumFractionDigits={0} />
      ),
      sortable: true,
      sortFunction: (row1, row2) => Number(BigInt(row1.escrow ?? 0) - BigInt(row2.escrow ?? 0)),
    },
    {
      name: t('validator.fee', 'Fee'),
      id: 'fee',
      selector: 'fee',
      sortable: true,
      width: '110px',
      cell: datum => (datum.current_rate !== undefined ? `${datum.current_rate * 100}%` : 'Unknown'),
      sortFunction: (row1, row2) => (row1.current_rate ?? 0) - (row2.current_rate ?? 0),
      hide: 'sm',
    },
  ]

  return (
    <Box pad="medium" background="background-front">
      {t('common.validators', 'Validators')}
      {updateValidatorsError && (
        <p>
          {t('account.validator.loadingError', "Couldn't load validators.")}{' '}
          {validators.length > 0 &&
            t('account.validator.showingStale', 'Showing validator list as of {{staleTimestamp}}.', {
              staleTimestamp: new Date(validatorsTimestamp!).toLocaleString(),
            })}
          <br />
          {validators.length <= 0 && (
            <ErrorFormatter code={updateValidatorsError.code} message={updateValidatorsError.message} />
          )}
        </p>
      )}
      <TypeSafeDataTable
        noHeader={true}
        columns={columns}
        data={validators}
        keyField="address"
        style={{}}
        customStyles={dataTableStyles}
        expandableRowsHideExpander
        expandableRows={true}
        expandableRowsComponent={
          <ValidatorItem
            data={{} as any}
            details={validatorDetails}
            isAddressInWallet={isAddressInWallet}
            key={selectedAddress}
          />
        }
        expandableRowExpanded={row => row.address === selectedAddress}
        sortIcon={<Down />}
        theme="blank"
        onRowClicked={rowClicked}
        highlightOnHover
        pointerOnHover
      />
    </Box>
  )
})
