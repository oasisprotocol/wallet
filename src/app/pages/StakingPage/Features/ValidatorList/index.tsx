/**
 *
 * ValidatorList
 *
 */
import { ErrorFormatter } from 'app/components/ErrorFormatter'
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
import { Box } from 'grommet/es6/components/Box'
import { Down } from 'grommet-icons/es6/icons/Down'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { dataTableCustomStyles } from 'styles/theme/dataTableTheme'
import { TypeSafeDataTable, ITypeSafeDataTableColumn } from 'types/TypeSafeDataTable'
import { isWebUri } from 'valid-url'

import { ValidatorItem } from './ValidatorItem'
import { intlDateTimeFormat } from 'app/components/DateFormatter/intlDateTimeFormat'
import { StakeSubnavigation } from '../../../AccountPage/Features/StakeSubnavigation'
import { selectAccountAvailableBalance } from '../../../../state/account/selectors'
import { AmountCell, FeeCell, IconCell, NameCell, StatusCell } from '../TableCell'

interface Props {}

export const ValidatorList = memo((props: Props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const validators = useSelector(selectValidators)
  const validatorsTimestamp = useSelector(selectValidatorsTimestamp)
  const updateValidatorsError = useSelector(selectUpdateValidatorsError)
  const isAddressInWallet = useSelector(selectIsAddressInWallet)
  const accountAvailableBalance = useSelector(selectAccountAvailableBalance)
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
          <IconCell onClick={() => rowClicked(datum)} src={datum.media.logotype} />
        ),
      width: '34px',
    },
    {
      name: '',
      id: 'status',
      cell: datum => <StatusCell onClick={() => rowClicked(datum)} status={datum.status} />,
      width: '34px',
    },
    {
      name: t('validator.name', 'Name'),
      id: 'name',
      selector: 'name',
      maxWidth: '40ex',
      minWidth: '15ex',
      cell: datum => datum.name ?? <NameCell address={datum.address} onClick={() => rowClicked(datum)} />,
      sortable: true,
      sortFunction: (row1, row2) => (row1.name ?? row1.address).localeCompare(row2.name ?? row2.address),
    },
    {
      name: t('validator.escrow', 'Escrow'),
      id: 'escrow',
      selector: 'escrow',
      width: '28ex',
      right: true,
      hide: 'sm',
      cell: datum => <AmountCell amount={datum.escrow} onClick={() => rowClicked(datum)} />,
      sortable: true,
      sortFunction: (row1, row2) => Number(BigInt(row1.escrow ?? 0) - BigInt(row2.escrow ?? 0)),
    },
    {
      name: t('validator.fee', 'Fee'),
      id: 'fee',
      selector: 'fee',
      sortable: true,
      width: '110px',
      right: true,
      cell: datum => <FeeCell fee={datum.current_rate} onClick={() => rowClicked(datum)} />,
      sortFunction: (row1, row2) => (row1.current_rate ?? 0) - (row2.current_rate ?? 0),
      hide: 'sm',
    },
  ]

  return (
    <>
      <StakeSubnavigation />
      <Box as="section" data-testid="validators-list">
        <Box pad="medium" background="background-front">
          {updateValidatorsError && (
            <p>
              <span>{t('account.validator.loadingError', "Couldn't load validators.")}</span>
              {validators.length > 0 && (
                <span>
                  {' '}
                  {t('account.validator.showingStale', 'Showing validator list as of {{staleTimestamp}}.', {
                    staleTimestamp: intlDateTimeFormat(validatorsTimestamp!),
                  })}
                </span>
              )}
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
            customStyles={dataTableCustomStyles}
            expandableRowsHideExpander
            expandableRows={true}
            expandableRowsComponent={
              <ValidatorItem
                data={{} as any}
                details={validatorDetails}
                accountAvailableBalance={accountAvailableBalance}
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
      </Box>
    </>
  )
})
