/**
 *
 * AccountPage
 *
 */
import { Box, Layer, Spinner, Text } from 'grommet'
import * as React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { SendTransaction } from '../WalletPage/Features/SendTransaction'
import { selectAddress, selectStatus } from '../WalletPage/slice/selectors'
import { AccountSummary } from './Features/AccountSummary'
import { TransactionHistory } from './Features/TransactionHistory'
import { useAccountSlice } from './slice'
import { selectAccount } from './slice/selectors'
import { BalanceDetails } from './slice/types'

interface Props {}

interface AccountPageParams {
  address: string
}

export function AccountPage(props: Props) {
  const accountActions = useAccountSlice().actions
  const { address } = useParams<AccountPageParams>()
  const dispatch = useDispatch()

  const account = useSelector(selectAccount)
  const walletIsOpen = useSelector(selectStatus)
  const walletAddress = useSelector(selectAddress)

  const isLoading = account.loading

  const balance: BalanceDetails = {
    available: account.liquid_balance ?? 0,
    debonding: account.debonding_balance ?? 0,
    delegations: account.delegations_balance ?? 0,
    escrow: account.escrow_balance ?? 0,
    total: account.total_balance ?? 0,
  }

  useEffect(() => {
    dispatch(accountActions.fetchAccount(address))
  }, [dispatch, accountActions, address])

  return (
    <Box pad="small">
      {isLoading && (
        <Layer position="center" responsive={false}>
          <Box pad="medium" gap="medium" direction="row" align="center">
            <Spinner size="medium" />
            <Text size="large">Loading account</Text>
          </Box>
        </Layer>
      )}
      {/* <div>
        {account.address} {account.total_balance}
      </div> */}
      <AccountSummary
        address={account.address}
        balance={balance}
        walletAddress={walletAddress}
        walletIsOpen={walletIsOpen}
      />
      <Box direction="row-responsive" pad={{ vertical: 'small' }} gap="small">
        {walletIsOpen && (
          <Box flex basis="1/4" width={{ min: '300px' }}>
            <SendTransaction />
          </Box>
        )}
        <Box flex basis="3/4">
          <TransactionHistory />
        </Box>
      </Box>
    </Box>
  )
}
