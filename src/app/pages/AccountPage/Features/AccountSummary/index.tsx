import { AddressBox } from 'app/components/AddressBox'
import { AmountFormatter } from 'app/components/AmountFormatter'
import { Box, Grid, ResponsiveContext, Text } from 'grommet'
import * as QRCode from 'qrcode.react'
import * as React from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectTheme } from 'styles/theme/slice/selectors'

import { BalanceDetails } from '../../../../state/account/types'

export interface AccountSummaryProps {
  address: string

  balance: BalanceDetails
  walletIsOpen?: boolean
  walletAddress?: string
}

export function AccountSummary(props: AccountSummaryProps) {
  const { t } = useTranslation()
  const theme = useSelector(selectTheme)
  const balance = props.balance
  const address = props.address
  const walletIsOpen = props.walletIsOpen
  const walletAddress = props.walletAddress
  const size = useContext(ResponsiveContext)

  return (
    <Box round="5px" border={{ color: 'background-front-border', size: '1px' }} background="background-front">
      <Box pad="small" direction="row-responsive" flex>
        <Box>
          <AddressBox address={address} />
          <Grid
            columns={['auto', 'auto']}
            gap={{ column: 'medium' }}
            pad={{ top: 'small' }}
            responsive={false}
          >
            <Box pad={{ bottom: 'small' }}>
              <Text weight="bold" size="xlarge">
                {t('account.summary.balance.total')}
              </Text>
            </Box>
            <Box justify="center" pad={{ bottom: 'small' }}>
              <Text weight="bold" size="xlarge" data-testid="account-balance">
                <AmountFormatter amount={balance.total} />
              </Text>
            </Box>

            <Box>{t('account.summary.balance.available')}</Box>
            <Box>
              <Text>
                <AmountFormatter amount={balance.available} />
              </Text>
            </Box>

            <Box>{t('account.summary.balance.delegations')}</Box>
            <Box>
              <Text>
                <AmountFormatter amount={balance.delegations} />
              </Text>
            </Box>

            <Box>{t('account.summary.balance.debonding')}</Box>
            <Box>
              <Text>
                <AmountFormatter amount={balance.debonding} />
              </Text>
            </Box>
          </Grid>
        </Box>
        {size !== 'small' && (
          <Box align="end" flex>
            <QRCode value={address} fgColor={theme === 'light' ? '#333333' : '#e8e8e8'} bgColor="#00000000" />
          </Box>
        )}
      </Box>
      {walletIsOpen && walletAddress === address && (
        <Box
          border={{
            color: 'status-ok',
            side: 'left',
            size: '3px',
          }}
          background={{
            color: 'status-ok',
            opacity: 0.2,
          }}
          pad={{ horizontal: 'small', vertical: 'xsmall' }}
        >
          <Text weight="bold">{t('account.summary.yourAccount', 'This is your account.')}</Text>
        </Box>
      )}
      {walletIsOpen && walletAddress !== address && (
        <Box
          border={{
            color: 'status-warning',
            side: 'left',
            size: '3px',
          }}
          background={{
            color: 'status-warning',
            opacity: 0.2,
          }}
          pad={{ horizontal: 'small', vertical: 'xsmall' }}
        >
          <Text weight="bold">
            {t(
              'account.summary.notYourAccount',
              'This is not your account. Click here to go to your open wallet.',
            )}
          </Text>
        </Box>
      )}
    </Box>
  )
}
