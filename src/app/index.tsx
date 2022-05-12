/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import { Box, Main, ResponsiveContext } from 'grommet'
import * as React from 'react'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Switch } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'
import { FatalErrorHandler } from './components/FatalErrorHandler'
import { Footer } from './components/Footer'
import { Navigation } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
import { TransitionRoute } from './components/TransitionRoute'
import { AccountPage } from './pages/AccountPage'
import { CreateWalletPage } from './pages/CreateWalletPage'
import { HomePage } from './pages/HomePage'
import { OpenWalletPage } from './pages/OpenWalletPage'
import { ModalProvider } from './components/Modal'
import { useRouteRedirects } from './useRouteRedirects'

const AppMain = styled(Main)`
  /* position: relative; */
`

export function App() {
  useRouteRedirects()
  const { i18n } = useTranslation()
  const size = useContext(ResponsiveContext)

  return (
    <ModalProvider>
      <Helmet
        titleTemplate="%s - Oasis Wallet"
        defaultTitle="Oasis Wallet"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A wallet for Oasis" />
      </Helmet>
      <Box direction="row-responsive" background="background-back" fill style={{ minHeight: '100vh' }}>
        <Navigation />
        <Box flex pad={{ top: size === 'small' ? '64px' : undefined }}>
          <AppMain>
            <FatalErrorHandler />
            <Toolbar />
            <TransitionGroup>
              <Switch>
                <TransitionRoute exact path="/" component={HomePage} />
                <TransitionRoute exact path="/create-wallet" component={CreateWalletPage} />
                <TransitionRoute path="/open-wallet" component={OpenWalletPage} />
                <TransitionRoute exact path="/account/:address/stake" component={AccountPage} />
                <TransitionRoute path="/account/:address" component={AccountPage} />
              </Switch>
            </TransitionGroup>
            <Footer />
          </AppMain>
        </Box>
      </Box>
    </ModalProvider>
  )
}
