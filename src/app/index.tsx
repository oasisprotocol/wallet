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
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { FatalErrorHandler } from './components/FatalErrorHandler'
import { Footer } from './components/Footer'
import { Navigation } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
import { ModalProvider } from './components/Modal'
import { useRouteRedirects } from './useRouteRedirects'
import { PersistLoadingGate } from 'app/components/Persist/PersistLoadingGate'
import { UnlockGate } from 'app/components/Persist/UnlockGate'
import { BuildPreviewBanner } from 'app/components/BuildPreviewBanner'

const AppMain = styled(Main)`
  /* position: relative; */
`

export function App() {
  useRouteRedirects()
  const { i18n } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <ModalProvider>
      <Helmet
        titleTemplate="%s - Oasis Wallet"
        defaultTitle="Oasis Wallet"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A wallet for Oasis" />
      </Helmet>
      <FatalErrorHandler />
      {!isMobile && <BuildPreviewBanner />}
      <Box direction="row-responsive" background="background-back" fill style={{ minHeight: '100vh' }}>
        <PersistLoadingGate>
          <UnlockGate>
            <Navigation />
            <Box flex pad={{ top: isMobile ? '64px' : undefined }}>
              <AppMain>
                {isMobile && <BuildPreviewBanner />}
                <FatalErrorHandler />
                <Toolbar />
                <Outlet />
                <Footer />
              </AppMain>
            </Box>
          </UnlockGate>
        </PersistLoadingGate>
      </Box>
    </ModalProvider>
  )
}
