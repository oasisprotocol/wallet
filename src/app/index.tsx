/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import { Box } from 'grommet/es6/components/Box'
import { Main } from 'grommet/es6/components/Main'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import * as React from 'react'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { FatalErrorHandler } from './components/FatalErrorHandler'
import { Footer } from './components/Footer'
import { Navigation } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
import { ModalProvider } from './components/Modal'
import { PersistLoadingGate } from 'app/components/Persist/PersistLoadingGate'
import { UnlockGate } from 'app/components/Persist/UnlockGate'
import { BuildPreviewBanner } from 'app/components/BuildPreviewBanner'

export function App() {
  const { i18n } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <FatalErrorHandler>
      <ModalProvider>
        <Helmet
          titleTemplate="%s - Oasis Wallet"
          defaultTitle="Oasis Wallet"
          htmlAttributes={{ lang: i18n.language }}
        >
          <meta name="description" content="A wallet for Oasis" />
        </Helmet>
        {!isMobile && <BuildPreviewBanner />}
        <Box direction="row-responsive" background="background-back" fill style={{ minHeight: '100vh' }}>
          <PersistLoadingGate>
            <UnlockGate>
              <Navigation />
              <Box flex pad={{ top: isMobile ? '64px' : undefined }}>
                <Main>
                  {isMobile && <BuildPreviewBanner />}
                  <Toolbar />
                  <Outlet />
                  <Footer />
                </Main>
              </Box>
            </UnlockGate>
          </PersistLoadingGate>
        </Box>
      </ModalProvider>
    </FatalErrorHandler>
  )
}
