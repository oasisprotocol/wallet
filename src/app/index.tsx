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
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { FatalErrorHandler } from './components/FatalErrorHandler'
import { Footer } from './components/Footer'
import { Navigation } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
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
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/create-wallet" component={CreateWalletPage} />
              <Route path="/open-wallet" component={OpenWalletPage} />
              <Route exact path="/account/:address/stake" component={AccountPage} />
              <Route path="/account/:address" component={AccountPage} />
            </Switch>
            <Footer />
          </AppMain>
        </Box>
      </Box>
    </ModalProvider>
  )
}
