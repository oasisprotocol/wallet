/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import { ConnectedRouter } from 'connected-react-router'
import { Box, Main } from 'grommet'
import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Switch } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'

import { history } from './../store/reducers'
import { Navigation } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
import { TransitionRoute } from './components/TransitionRoute'
import { AccountPage } from './pages/AccountPage'
import { CreateWalletPage } from './pages/CreateWalletPage'
import { HomePage } from './pages/HomePage'
import { OpenWalletPage } from './pages/OpenWalletPage'
import { StakingPage } from './pages/StakingPage'
import { WalletPage } from './pages/WalletPage'

const AppMain = styled(Main)`
  position: relative;
`

export function App() {
  const { i18n } = useTranslation()
  return (
    <ConnectedRouter history={history}>
      <Helmet
        titleTemplate="%s - Oasis Wallet"
        defaultTitle="Oasis Wallet"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A wallet for Oasis" />
      </Helmet>
      <Box direction="row-responsive" fill>
        <Navigation />
        <Box flex>
          <AppMain background="light-2">
            <Toolbar />
            <TransitionGroup>
              <Switch>
                <TransitionRoute exact path="/" component={HomePage} />
                <TransitionRoute exact path="/create-wallet" component={CreateWalletPage} />
                <TransitionRoute path="/open-wallet" component={OpenWalletPage} />
                <TransitionRoute exact path="/wallet" component={WalletPage} />
                <TransitionRoute exact path="/stake" component={StakingPage} />
                <TransitionRoute path="/account/:address" component={AccountPage} />
              </Switch>
            </TransitionGroup>
          </AppMain>
        </Box>
      </Box>
    </ConnectedRouter>
  )
}
