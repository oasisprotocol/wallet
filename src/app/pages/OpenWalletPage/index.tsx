/**
 *
 * OpenWalletPage
 *
 */
import { TransitionRoute } from 'app/components/TransitionRoute'
import { Box, Button, Heading } from 'grommet'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from 'react-router'
import { NavLink } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'

import { FromMnemonic } from './Features/FromMnemonic'
import { FromPrivateKey } from './Features/FromPrivateKey'

export function SelectOpenMethod() {
  const { t } = useTranslation()

  return (
    <Box
      round="5px"
      border={{ color: 'light-3', size: '1px' }}
      background="white"
      margin="small"
      pad="medium"
    >
      <Heading level="3">{t('openWallet.header', 'How do you want to open your wallet ?')}</Heading>

      <Box direction="row-responsive" justify="start" margin={{ top: 'medium' }} gap="medium">
        <NavLink to="/open-wallet/mnemonic">
          <Button
            type="submit"
            label={t('openWallet.method.mnemonic', 'Mnemonic')}
            style={{ borderRadius: '4px' }}
            primary
          />
        </NavLink>
        <NavLink to="/open-wallet/private-key">
          <Button
            type="submit"
            label={t('openWallet.method.privateKey', 'privateKey')}
            style={{ borderRadius: '4px' }}
            primary
          />
        </NavLink>
        <NavLink to="/open-wallet/ledger">
          <Button
            type="submit"
            label={t('openWallet.method.ledger', 'Ledger')}
            style={{ borderRadius: '4px' }}
            primary
            disabled
          />
        </NavLink>
      </Box>
    </Box>
  )
}

interface Props {}
export function OpenWalletPage(props: Props) {
  return (
    <TransitionGroup>
      <Switch>
        <TransitionRoute exact path="/open-wallet" component={SelectOpenMethod} />
        <TransitionRoute exact path="/open-wallet/mnemonic" component={FromMnemonic} />
        <TransitionRoute exact path="/open-wallet/private-key" component={FromPrivateKey} />
        {/* <TransitionRoute exact path="/open-wallet/ledger" /> */}
      </Switch>
    </TransitionGroup>
  )
}
