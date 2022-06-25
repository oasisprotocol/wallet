/**
 *
 * AccountPage
 *
 */
import { AlertBox } from 'app/components/AlertBox'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { TransactionModal } from 'app/components/TransactionModal'
import { TransitionRoute } from 'app/components/TransitionRoute'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { stakingActions } from 'app/state/staking'
import { selectStaking } from 'app/state/staking/selectors'
import { selectTransaction } from 'app/state/transaction/selectors'
import { walletActions } from 'app/state/wallet'
import { Box, Layer, Spinner, Text } from 'grommet'
import * as React from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Switch, useLocation, useParams } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'

import { accountActions } from '../../state/account'
import { selectAccount } from '../../state/account/selectors'
import { BalanceDetails } from '../../state/account/types'
import {
  selectAddress,
  selectIsOpen,
  selectWallets,
  selectWalletsPublicKeys,
} from '../../state/wallet/selectors'
import { ActiveDelegationList } from '../StakingPage/Features/DelegationList/ActiveDelegationList'
import { DebondingDelegationList } from '../StakingPage/Features/DelegationList/DebondingDelegationList'
import { ValidatorList } from '../StakingPage/Features/ValidatorList'
import { AccountDetails } from './Features/AccountDetails'
import { AccountSummary } from './Features/AccountSummary'

interface NavItemProps {
  label: string
  route: string
}

const NavItem = (props: NavItemProps) => {
  const route = props.route
  const label = props.label

  const location = useLocation()
  const isActive = route && route === location.pathname

  return (
    <NavLink to={route}>
      <Box
        pad="xsmall"
        // onClick={() => {}} hoverIndicator={{ color: 'background-oasis-blue' }}
      >
        <Box
          border={{ side: 'bottom', color: isActive ? 'oasisBlue2' : 'background-contrast-2', size: '2px' }}
          pad={{ bottom: 'xxsmall', horizontal: 'xxsmall' }}
        >
          {label}
        </Box>
      </Box>
    </NavLink>
  )
}

interface Props {}

interface AccountPageParams {
  address: string
}

export function AccountPage(props: Props) {
  const { t } = useTranslation()

  const { address } = useParams<AccountPageParams>()
  const dispatch = useDispatch()

  const account = useSelector(selectAccount)
  const stake = useSelector(selectStaking)

  const walletIsOpen = useSelector(selectIsOpen)
  const walletAddress = useSelector(selectAddress)
  const selectedNetwork = useSelector(selectSelectedNetwork)
  const { active } = useSelector(selectTransaction)
  const wallets = useSelector(selectWallets)
  const walletsPublicKeys = useSelector(selectWalletsPublicKeys)

  const balanceDelegations = stake.delegations.reduce((acc, v) => acc + Number(v.amount), 0)
  const balanceDebondingDelegations = stake.debondingDelegations.reduce((acc, v) => acc + Number(v.amount), 0)
  const balance: BalanceDetails = {
    available: account.available,
    delegations: balanceDelegations, //@TODO oasis-explorer : account.debonding_delegations_balance ?? 0,
    debonding: balanceDebondingDelegations, //@TODO oasis-explorer : account.delegations_balance ?? 0,
    total:
      account.available == null ? null : account.available + balanceDelegations + balanceDebondingDelegations,
  }

  // Reload account balances if address or network changes
  useEffect(() => {
    dispatch(accountActions.fetchAccount(address))
    dispatch(stakingActions.fetchAccount(address))
    return () => {
      dispatch(accountActions.clearAccount())
    }
  }, [dispatch, address, selectedNetwork])

  // Reload wallet balances if network changes
  useEffect(() => {
    for (const wallet of Object.values(wallets)) {
      dispatch(walletActions.fetchWallet(wallet))
    }
    // Using `walletsPublicKeys` dependency instead of `wallets` to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, walletsPublicKeys.join(','), selectedNetwork])

  return (
    <Box pad="small">
      {active && <TransactionModal />}
      {(stake.loading || account.loading) && (
        <Layer modal background="background-front" responsive={false}>
          <Box pad="medium" gap="medium" direction="row" align="center">
            <Spinner size="medium" />
            <Text size="large">{t('account.loading', 'Loading account')}</Text>
          </Box>
        </Layer>
      )}
      {account.accountError && (
        <AlertBox color="status-error">
          {t('account.loadingError', "Couldn't load account.")}{' '}
          <ErrorFormatter code={account.accountError.code} message={account.accountError.message} />
        </AlertBox>
      )}
      {stake.updateDelegationsError && (
        <AlertBox color="status-error">
          {t('delegations.loadingError', "Couldn't load delegations.")}{' '}
          <ErrorFormatter
            code={stake.updateDelegationsError.code}
            message={stake.updateDelegationsError.message}
          />
        </AlertBox>
      )}
      {address && address !== '' && (
        <>
          <AccountSummary
            address={address}
            balance={balance}
            walletAddress={walletAddress}
            walletIsOpen={walletIsOpen}
          />
          <Box background="background-front" margin={{ vertical: 'small' }} direction="row" gap="small" wrap>
            <NavItem
              route={`/account/${address}`}
              label={t('account.subnavigation.transactions', 'Transactions')}
            />
            <NavItem
              route={`/account/${address}/active-delegations`}
              label={t('account.subnavigation.activeDelegations', 'Active delegations ({{count}})', {
                count: stake.delegations.length,
              })}
            />
            <NavItem
              route={`/account/${address}/debonding-delegations`}
              label={t('account.subnavigation.debondingDelegations', 'Debonding delegations ({{count}})', {
                count: stake.debondingDelegations.length,
              })}
            />
          </Box>
          <TransitionGroup>
            <Switch>
              <TransitionRoute exact path="/account/:address" component={AccountDetails} />
              <TransitionRoute exact path="/account/:address/stake" component={ValidatorList} />
              <TransitionRoute
                exact
                path="/account/:address/active-delegations"
                component={ActiveDelegationList}
              />
              <TransitionRoute
                exact
                path="/account/:address/debonding-delegations"
                component={DebondingDelegationList}
              />
            </Switch>
          </TransitionGroup>
        </>
      )}
    </Box>
  )
}
